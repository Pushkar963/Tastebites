const User = require("../models/user.js");
const Restaurant = require("../models/restaurant.js");
const MenuItem = require("../models/menuItem.js");
const Order = require("../models/order.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");


module.exports.dashboard = async (req, res) => {
    const [
        totalUsers,
        totalRestaurants,
        activeRestaurants,
        totalMenuItems,
        totalOrders,
        totalReviews,
        revenueResult,
    ] = await Promise.all([
        User.countDocuments(),
        Restaurant.countDocuments(),
        Restaurant.countDocuments({ isActive: true }),
        MenuItem.countDocuments(),
        Order.countDocuments(),
        Review.countDocuments(),
        Order.aggregate([
            { $match: { paymentStatus: "COMPLETED" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
    ]);

    const stats = {
        totalUsers,
        totalRestaurants,
        activeRestaurants,
        inactiveRestaurants: totalRestaurants - activeRestaurants,
        totalMenuItems,
        totalOrders,
        totalReviews,
        revenue: revenueResult[0]?.total || 0,
    };

    res.render("admin/dashboard", { stats, activePage: "dashboard" });
};

module.exports.listRestaurants = async (req, res) => {
    const restaurants = await Restaurant.find()
        .populate("ownerId", "username email")
        .sort({ createdAt: -1 });

    res.render("admin/restaurants", { restaurants, activePage: "restaurants" });
};

module.exports.setRestaurantStatus = async (req, res) => {
    const { id } = req.params;
    const isActive = req.body.isActive === "true";

    const restaurant = await Restaurant.findByIdAndUpdate(
        id,
        { isActive, suspendedByAdmin: !isActive },
        { new: true }
    );
    if (!restaurant) throw new ExpressError(404, "Restaurant not found.");

    req.flash("success", `${restaurant.name} is now ${isActive ? "active" : "deactivated"}.`);
    res.redirect("/tastebite/admin/restaurants");
};

module.exports.deleteRestaurant = async (req, res) => {
    const { id } = req.params;

    // findByIdAndDelete triggers the post("findOneAndDelete") hook (cascade)
    const deleted = await Restaurant.findByIdAndDelete(id);
    if (!deleted) throw new ExpressError(404, "Restaurant not found.");

    req.flash("success", `${deleted.name} and all its menu items and reviews were permanently deleted.`);
    res.redirect("/tastebite/admin/restaurants");
};




const ALLOWED_ROLES = ["USER", "ADMIN"];

module.exports.listUsers = async (req, res) => {
    const users = await User.find()
        .select("username email role createdAt")
        .sort({ createdAt: -1 });

    res.render("admin/users", { users, activePage: "users" });
};

module.exports.setUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    // 1) never trust the form value
    if (!ALLOWED_ROLES.includes(role)) {
        throw new ExpressError(400, "Invalid role.");
    }

    // 2) an admin may not change their own role (prevents a lockout)
    if (req.user._id.equals(id)) {
        throw new ExpressError(400, "You cannot change your own role.");
    }

    // 3) update (runValidators makes the schema enum apply to updates too)
    const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
    );
    if (!user) throw new ExpressError(404, "User not found.");

    req.flash("success", `${user.username} is now ${role === "ADMIN" ? "an admin" : "a regular user"}.`);
    res.redirect("/tastebite/admin/users");
};