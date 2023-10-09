// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');

// gets a list of fragments for the current user
module.exports = (req, res) => {
  let fragments = [];
  res.status(200).json(createSuccessResponse({ fragments }));
};
