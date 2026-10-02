const Restaurant = require("../models/restaurant.js");
const Menu = require("../models/menuItem.js");


module.exports.search = async (req, res) => {
    const { q } = req.query;

    if (!q || !q.trim()) {
        return res.render("search/search", { restaurants: [], foods: [], query: "" });
    }

    const restaurants = await Restaurant.find(
        { $text: { $search: q }, isActive: true },
        { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    const foods = await Menu.find(
        { $text: { $search: q }, isAvailable: true }
    ).populate("restaurantId")
     .sort({ score: { $meta: "textScore" } });

    res.render("search/search", { restaurants, foods, query: q });
};