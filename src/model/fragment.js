// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');

// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();
const logger = require('../logger');
// sharp:
const sharp = require('sharp');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id = randomUUID(), ownerId, created, updated, type, size = 0 }) {
    if (!ownerId || !type) {
      throw new Error('Both ownerId and type are required fields');
    }
    if (typeof size !== 'number' || isNaN(size)) {
      throw new Error('Size must be a number');
    }
    if (size < 0) {
      throw new Error('Size cannot be negative');
    }
    if (
      !type.startsWith('text/') &&
      !type.startsWith('application/json') &&
      !type.startsWith('image')
    ) {
      throw new Error('Invalid type');
    }

    this.id = id;
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const fragment = await readFragment(ownerId, id);
    if (!fragment) {
      throw new Error(`Fragment with id ${id} not found.`);
    }
    return fragment;
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static async delete(ownerId, id) {
    return await deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  async save() {
    await writeFragment(this);
    this.updated = new Date().toISOString();
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    logger.info('getData()');
    try {
      return readFragmentData(this.ownerId, this.id);
    } catch (err) {
      logger.error({ err }, `Unable to get fragment data`);
    }
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    // Throw error if not given a buffer
    if (!Buffer.isBuffer(data)) {
      throw new Error('Data must be a buffer');
    }
    this.size = data.length;
    await writeFragmentData(this.ownerId, this.id, data);
    this.updated = new Date().toISOString();
    this.save(); // Saving after updating
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.mimeType.startsWith('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    const imageFormats = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    const textFormats = {
      'text/plain': ['text/plain'],
      'text/markdown': ['text/plain', 'text/html', 'text/markdown'],
      'text/html': ['text/plain', 'text/html'],
      'application/json': ['application/json', 'text/plain'],
    };

    for (const key of Object.keys(textFormats)) {
      if (this.type.includes(key)) {
        return textFormats[key];
      }
    }

    // If not textFormats then return imageFormats
    return imageFormats;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const validTypes = [
      'text/plain',
      'text/plain; charset=utf-8',
      'text/markdown',
      'text/html',
      'application/json',
      `image/png`,
      `image/jpeg`,
      `image/webp`,
      `image/gif`,
    ];
    return validTypes.includes(value);
  }

  /*
   * Does valid conversions with current content-type.
   */
  async convert(ext) {
    var fragment = await this.getData();
    var result;
    if (this.type.startsWith('text') || this.type.startsWith('application')) {
      if (ext == 'txt') {
        result = fragment;
      } else if (ext == 'html') {
        if (this.type.endsWith('markdown')) {
          result = md.render(fragment.toString());
        }
      }
    }

    // if converting an image
    if (this.type.startsWith('image')) {
      // Check what the value (ext) is and convert it accordingly
      if (ext == 'png' || ext == 'jpg' || ext == 'webp' || ext == 'gif') {
        // Convert any input to the ext
        result = await sharp(fragment).toFormat(ext).toBuffer();
      }
    }

    return result;
  }

  /*
   * If the valid ext is not the exact extension then convert the extension.
   * If ".txt" has type "text/html" convert it to "text/plain"
   */
  extFullName(value) {
    var extension;
    if (value == 'txt') {
      extension = 'plain';
    } else if (value == 'md') {
      extension = 'markdown';
    } else if (value == 'jpg') {
      extension = 'jpeg';
    } else {
      extension = value;
    }
    return extension;
  }
}

module.exports.Fragment = Fragment;
