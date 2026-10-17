const Restaurant = require("../models/restaurant.js");

// Returns an array with the _id of every publicly visible restaurant.
module.exports.getActiveRestaurantIds = () => {
    return Restaurant.distinct("_id", { isActive: true });
};