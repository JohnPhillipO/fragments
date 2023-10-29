// src/routes/api/getById.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
// Using node path module.
const path = require('path');

// Checks if its a valid type
function validTypes(contentType, extension) {
  let formats = [];
  switch (contentType) {
    case 'text/plain':
      formats = ['txt'];
      break;
    case 'text/markdown':
      formats = ['md', 'html', 'txt'];
      break;
    case 'text/html':
      formats = ['html', 'txt'];
      break;
    case 'application/json':
      formats = ['json', 'txt'];
      break;
    default:
      return false;
  }

  return formats.includes(extension);
}

module.exports = async (req, res) => {
  // Get the request params
  const idWithExt = req.params.id;

  // use path modules path.parse to split the idWithExit into respected objects
  // See https://nodejs.org/api/path.html#pathparsepath
  const query = path.parse(idWithExt);
  // get the Extension
  let extension = query.ext.split('.').pop();

  //const fragments = await Fragment.byUser(req.user);
  try {
    const fragment = await Fragment.byId(req.user, query.name);
    let data = null;

    if (!extension) {
      data = await fragment.getData();
    } else {
      if (validTypes(fragment.mimeType, extension)) {
        data = await fragment.getData();
      }
    }

    if (data) {
      res.setHeader('Content-Type', fragment.mimeType);
      res.status(200).send(Buffer.from(data));
    } else {
      res.status(415).json(createErrorResponse(415, 'unknown or unsupported type'));
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Id not found!'));
  }
};
