// src/routes/api/delete.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

// Deletes a fragment from the current user
module.exports = async (req, res) => {
  try {
    await Fragment.delete(req.user, req.params.id);
    res.status(200).send(createSuccessResponse(200, 'Fragment deleted.'));
    logger.info('Deleted the fragment');
  } catch (err) {
    res.status(404).send(createErrorResponse(404, 'Fragment not found'));
  }
};
