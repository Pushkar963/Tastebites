const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const adminController = require("../controller/admin.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");

// THE GATE — every route below this line requires a logged-in admin
router.use(isLoggedIn, isAdmin);

// Runs for every route that contains ":id"
router.param("id", (req, res, next, id) => {
    if (!mongoose.isValidObjectId(id)) {
        return next(new ExpressError(400, "Invalid id."));
    }
    next();
});

router.get("/", asyncWrap(adminController.dashboard));

// Restaurants
router.get("/restaurants", asyncWrap(adminController.listRestaurants));
router.patch("/restaurants/:id/status", asyncWrap(adminController.setRestaurantStatus));
router.delete("/restaurants/:id", asyncWrap(adminController.deleteRestaurant));

// Users
router.get("/users", asyncWrap(adminController.listUsers));
router.patch("/users/:id/role", asyncWrap(adminController.setUserRole));

module.exports = router;