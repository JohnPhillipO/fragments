// src/routes/api/getById.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
// Using node path module.
const path = require('path');
const logger = require('../../logger');

module.exports = async (req, res) => {
  // use path modules path.parse to split the idWithExit into respected objects
  const query = path.parse(req.params.id);
  // get the Extension
  let ext = query.ext.split('.').pop();
  try {
    const fragment = await Fragment.byId(req.user, query.name);
    let data = await fragment.getData();

    if (!ext || fragment.type.endsWith(fragment.extFullName(ext))) {
      // (no extension and has same type and ext) = no conversions
      res.setHeader('Content-Type', fragment.type);
      res.status(200).send(Buffer.from(data));
      logger.info(
        { fragmentData: data, contentType: fragment.type },
        `Fragment data retrieved successfully!`
      );
    } else {
      // Convert
      try {
        // Check if it's a image conversion or test conversion
        if (fragment.isText || fragment.type == 'application/json') {
          // Text conversion
          let result = await fragment.convert(ext);
          res.setHeader('Content-Type', `text/${fragment.extFullName(ext)}`);
          res.status(200).send(Buffer.from(result));
        } else {
          // Image conversion
          let result = await fragment.convert(ext);
          res.setHeader('Content-Type', `image/${fragment.extFullName(ext)}`);
          res.status(200).send(result);
        }
      } catch (err) {
        res.status(415).json(createErrorResponse(415, 'unknown or unsupported type'));
      }
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Id not found!'));
  }
};
