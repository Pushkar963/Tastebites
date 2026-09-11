const express = require('express');
const router = express.Router();

const asyncWrap = require("../utils/asyncWrap.js");
const indexController = require("../controller/index.js");

app.get('/', (req, res) => {
  res.redirect('/tastebite');
});

// Index Route
router.get("/",  asyncWrap(indexController.index));

// Show all Foods Route
router.get("/foods", asyncWrap (indexController.allfoods));



module.exports = router;