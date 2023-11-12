// src/routes/api/getInfo.js
// Return the existing fragments metadata using their Id
const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    res.status(200).send(createSuccessResponse({ fragment: fragment }));
    // Logging the info to check if successful
    logger.info({ fragment: fragment }, 'Fragment metadata was retrieved');
  } catch (err) {
    res.status(404).send(createErrorResponse(404, 'Fragment metadata with ID was not found'));
  }
};
