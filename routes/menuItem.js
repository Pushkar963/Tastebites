const express = require('express');
const router = express.Router({ mergeParams: true });

const asyncWrap = require("../utils/asyncWrap.js");
const menuController = require("../controller/menuItem.js");
const { isLoggedIn, isOwner, validateMenuItem, sanitizeBody } = require("../middleware.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router.post("/", isLoggedIn, upload.single('image'), sanitizeBody, validateMenuItem, asyncWrap (menuController.newFood));

router.get("/new", isLoggedIn, isOwner, asyncWrap (menuController.renderNewFoodForm));

router.route("/:foodId")
    .put(isLoggedIn, isOwner, upload.single('image'), sanitizeBody, validateMenuItem, asyncWrap (menuController.editFood))
    .delete(isLoggedIn, isOwner,  asyncWrap (menuController.deleteFood));

router.get("/:foodId/edit", isLoggedIn, isOwner, asyncWrap (menuController.renderEditFoodForm));



module.exports = router;

