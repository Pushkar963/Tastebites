const Restaurant = require("../models/restaurant.js")
const Menu = require("../models/menuItem.js")

module.exports.index = async (req, res) => {
    const { category } = req.query;
    let restaurantFilter = { isActive: true };
    let foodFilter = { isAvailable: true };

    if (category && category !== "all") {
        if (category === "surplus") {
            foodFilter.discountedPrice = { $ne: null };
            // restaurants aren't directly filtered for surplus — left as-is intentionally
        } else {
            restaurantFilter.cuisines = { $regex: new RegExp(category, "i") };
            foodFilter.category = { $regex: new RegExp(category, "i") };
        }
    }

    const allRestaurants = await Restaurant.find(restaurantFilter);
    const menuItems = await Menu.find(foodFilter).populate("restaurantId");

    res.render("index", { allRestaurants, menuItems, activeCategory: category || "all" });
}

module.exports.allfoods = async (req, res) => {
    let foods = await Menu.find({}).populate("restaurantId");
    res.render("foods", { foods });
}