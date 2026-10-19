const Restaurant = require("../models/restaurant.js");
const Menu = require("../models/menuItem.js");
const { getActiveRestaurantIds } = require("../utils/activeRestaurants.js");

module.exports.search = async (req, res) => {
    const { q } = req.query;
    const activeIds = await getActiveRestaurantIds();

    if (!q || !q.trim()) {
        return res.render("search/search", { restaurants: [], foods: [], query: "" });
    }

    const restaurants = await Restaurant.find(
        { $text: { $search: q }, isActive: true },
        { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    // const foods = await Menu.find(
    //     { $text: { $search: q }, isAvailable: true }
    // ).populate("restaurantId")
    //  .sort({ score: { $meta: "textScore" } });
    const foods = await Menu.find({ $text: { $search: q }, isAvailable: true, restaurantId: { $in: activeIds } });

    res.render("search/search", { restaurants, foods, query: q });
};