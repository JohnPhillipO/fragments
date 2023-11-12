// src/routes/api/getById.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
// Using node path module.
const path = require('path');

module.exports = async (req, res) => {
  // use path modules path.parse to split the idWithExit into respected objects
  const query = path.parse(req.params.id);
  // get the Extension
  let ext = query.ext.split('.').pop();
  try {
    const fragment = await Fragment.byId(req.user, query.name);
    let data = null;

    if (!ext || fragment.mimeType.endsWith(fragment.extFullName(ext))) {
      // (no extension and has same type and ext) = no conversions
      data = await fragment.getData();
      res.setHeader('Content-Type', fragment.mimeType);
      res.status(200).send(Buffer.from(data));
    } else {
      // Convert
      try {
        data = await fragment.convert(ext);
        res.setHeader('Content-Type', `text/${fragment.extFullName(ext)}`);
        res.status(200).send(Buffer.from(data));
      } catch (err) {
        res.status(415).json(createErrorResponse(415, 'unknown or unsupported type'));
      }
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Id not found!'));
  }
};
