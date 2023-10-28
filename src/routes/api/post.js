// src/routes/api/post.js
// Use Fragment Class
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../response');

// require('dotenv').config();

module.exports = async (req, res) => {
  if (Buffer.isBuffer(req.body) && Fragment.isSupportedType(req.headers['content-type'])) {
    const type = req.headers['content-type'];
    const ownerId = req.user;
    const fragment = new Fragment({ ownerId, type });

    await fragment.save();
    await fragment.setData(req.body);

    const location = `${process.env.API_URL || req.header.host}/v1/fragments/${fragment.id}`;
    // Set location header using API URL
    res.setHeader('Location', location);
    // Return a success response
    res.status(201).json(createSuccessResponse({ fragment: fragment }));
    return;
  }

  // If the conditions above are not met, handle the error case.
  logger.error(`Invalid: ${req.body} and ${req.headers['content-type']}`);
  res.status(415).json(createErrorResponse(415, 'Invalid file type'));
};
