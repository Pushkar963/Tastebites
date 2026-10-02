const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const searchController = require("../controller/search.js");

router.get("/search", asyncWrap(searchController.search));

module.exports = router;