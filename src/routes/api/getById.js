// src/routes/api/getById.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  // Get the request params
  const idWithExt = req.params.id;

  const idWithExtArray = idWithExt.split('.');

  let id;
  let ext;

  if (idWithExtArray.length > 1) {
    id = idWithExtArray.slice(0, idWithExtArray.length - 1).join('.');
    ext = idWithExtArray[idWithExtArray.length - 1];
  } else {
    id = idWithExtArray[0];
    ext = null;
  }

  const fragments = await Fragment.byUser(req.user);

  if (fragments.includes(id)) {
    const fragmentObj = await Fragment.byId(req.user, id);

    let fragment;

    if (fragmentObj instanceof Fragment) {
      fragment = fragmentObj;
    } else {
      fragment = new Fragment({
        id: id,
        ownerId: fragmentObj.ownerId,
        created: fragmentObj.created,
        update: fragmentObj.update,
        type: fragmentObj.type,
        size: fragmentObj.size,
      });
    }

    if (fragment) {
      let dataResult = null;

      if (!ext) {
        dataResult = await fragment.getData();
      } else {
        // Change: Only text/plain and .txt are valid types
        if (fragment.mimeType == 'text/plain' && ext == 'txt') {
          dataResult = await fragment.getData();
        }
      }

      if (dataResult) {
        res.setHeader('Content-Type', fragment.mimeType);
        res.status(200).json(createSuccessResponse({ fragment: dataResult }));
      } else {
        res.status(415).json(createErrorResponse(415, 'unknown or unsupported type'));
      }
    }
  } else {
    res.status(404).json(createErrorResponse(404, 'Id not found!'));
  }
};
