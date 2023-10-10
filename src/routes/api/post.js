// src/routes/api/post.js
// Use Fragment Class
const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  if (Buffer.isBuffer(req.body) && Fragment.isSupportedType(req.headers['content-type'])) {
    const type = req.headers['content-type'];
    const ownerId = req.user;
    const fragment = new Fragment({ ownerId, type });

    await fragment.save();
    await fragment.setData(req.body);

    // const location = `${process.env.API_URL || req.header.host}/v1/fragments/${fragment.id}`;
    // // Set location header using API URL
    // res.setHeader({ Location: location });
    // Return a success response
    res.status(201).json(createSuccessResponse({ fragment: fragment }));
  } else {
    res.status(415).json(createErrorResponse(415, 'Invalid file type'));
  }
};
