// src/routes/api/getById.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
// Using node path module.
const path = require('path');

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
      // Change: Only text/plain and .txt are valid types
      if (fragment.mimeType == 'text/plain' && extension == 'txt') {
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
