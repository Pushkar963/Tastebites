const Restaurant = require("../models/restaurant.js")
const Menu = require("../models/menuItem.js")

module.exports.index = async (req, res) => {
    const allRestaurants = await Restaurant.find({});
    const menuItems = await Menu.find({}).populate("restaurantId");
    res.render("index", { allRestaurants, menuItems });
}

module.exports.allfoods = async (req, res) => {
    let foods = await Menu.find({}).populate("restaurantId");
    res.render("foods", { foods });
}