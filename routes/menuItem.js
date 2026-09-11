const express = require('express');
const router = express.Router({ mergeParams: true });

const asyncWrap = require("../utils/asyncWrap.js");
const menuController = require("../controller/menuItem.js");
const { isLoggedIn, validateMenuItem, sanitizeBody } = require("../middleware.js");



router.post("/", isLoggedIn, sanitizeBody, validateMenuItem, asyncWrap (menuController.newFood));

router.get("/new", isLoggedIn, asyncWrap (menuController.renderNewFoodForm));

router.route("/:foodId")
    .put(isLoggedIn, sanitizeBody, validateMenuItem, asyncWrap (menuController.editFood))
    .delete(isLoggedIn,  asyncWrap (menuController.deleteFood));

router.get("/:foodId/edit", isLoggedIn, asyncWrap (menuController.renderEditFoodForm));



module.exports = router;

