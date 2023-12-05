const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    // If user put data was same content type. Else send error
    if (req.get('content-type') != fragment.type) {
      res.status(400).json(createErrorResponse(400, 'Fragment type cannot be changed.'));
    } else {
      await fragment.setData(req.body);
      await fragment.save();

      // Set location header
      const location = `${process.env.API_URL || req.header.host}/v1/fragments/${fragment.id}`;
      res.setHeader('Location', location);

      res.status(200).send(createSuccessResponse({ fragment: fragment }));
      logger.info({ fragment: fragment }, `Successfully updated fragment data!`);
    }
  } catch (err) {
    logger.error({ err }, `Invalid: ${req.user} and ${req.params.id}`);
    res.status(404).json(createErrorResponse(404, 'Unable to update fragment'));
  }
};
