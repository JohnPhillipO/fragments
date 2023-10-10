// src/routes/api/getById.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  // Get the request params
  const idWithExt = req.params.id;

  const idWithExtArray = idWithExt.split('.');
  const id = idWithExtArray[0];

  // Popping the id from idWithExtArray if it came with .*
  const ext = idWithExtArray.length > 1 ? idWithExtArray.pop() : null;

  const fragments = await Fragment.byUser(req.user);

  if (fragments.includes(id)) {
    const fragment = await Fragment.byId(req.user, id);

    if (fragment) {
      let data = null;

      if (!ext) {
        data = await fragment.getData();
      } else {
        // Change: Only text/plain and .txt are valid types
        if (fragment.mimeType == 'text/plain' && ext == 'txt') {
          data = await fragment.getData();
        }
      }

      if (data) {
        res.setHeader('Content-Type', fragment.mimeType);
        res.status(200).json(createSuccessResponse({ fragment: data }));
      } else {
        res.status(415).json(createErrorResponse(415, 'unknown or unsupported type'));
      }
    }
  } else {
    res.status(404).json(createErrorResponse(404, 'Id not found!'));
  }
};
