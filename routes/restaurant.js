const express = require('express');
const router = express.Router({ mergeParams: true });

const asyncWrap = require("../utils/asyncWrap.js");
const restaurantController = require("../controller/restaurant.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const { isLoggedIn, isOwner, validateRestaurant, sanitizeBody } = require("../middleware.js");


router.post("/", isLoggedIn, upload.single('image'), sanitizeBody, validateRestaurant, asyncWrap (restaurantController.newRestaurant));

router.get("/new", isLoggedIn, restaurantController.renderNewRestaurantForm )

router.route("/:id")
    .get(asyncWrap (restaurantController.showRestaurant))
    .put(isLoggedIn, isOwner, upload.single('image'), sanitizeBody, validateRestaurant , asyncWrap (restaurantController.editRestaurant))
    .delete(isLoggedIn, isOwner, asyncWrap (restaurantController.deleteRestaurant));


router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap (restaurantController.renderEditRestaurantForm));





module.exports = router;