// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

// gets a list of fragments for the current user
module.exports = async (req, res) => {
  // Check if included expand to get full representation
  const expand = req.query.expand == 1 ? true : false;
  const fragments = await Fragment.byUser(req.user, expand);
  res.status(200).json(createSuccessResponse({ fragments: fragments }));
};
