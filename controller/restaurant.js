const Restaurant = require("../models/restaurant.js");
const Menu = require("../models/menuItem.js");
const Review = require("../models/review.js");


module.exports.renderNewRestaurantForm = (req, res) => {
    res.render("newRestaurant.ejs")
}

module.exports.newRestaurant = async (req, res) => {
    const newRestaurant = new Restaurant(req.body.restaurant);
    newRestaurant.ownerId = req.user._id;

    if (req.file) {
        newRestaurant.imageURL = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await newRestaurant.save();

    req.flash("success", "New Restaurant Added");
    res.redirect("/tastebite");
    console.log(newRestaurant);
}

module.exports.showRestaurant = async (req, res) => {
    let { id } = req.params;
    const restaurant = await Restaurant.findById(`${id}`).populate("ownerId");
    const foods = await Menu.find({restaurantId: id}).populate("restaurantId");
    const reviews = await Review.find({restaurantId: id}).populate("reviewerName").sort({ createdAt: -1 });
    
    if (!restaurant) {
        req.flash("error", "Restaurant doesn't exist");
        return res.redirect("/tastebite");
    }

    const canSeeInactive =
    req.user &&
    (req.user.role === "ADMIN" ||
        (restaurant.ownerId && restaurant.ownerId.equals(req.user._id)));

    if (!restaurant.isActive && !canSeeInactive) {
        throw new ExpressError(404, "Page Not Found");
    }

    let sumRating = 0;
    for (let review of reviews) {
        sumRating = sumRating + review.rating;
    }
    
    let avgRating = reviews.length > 0 ? Math.floor((sumRating / reviews.length) * 10) / 10 : 0;
    let avgStar = Math.floor(avgRating);

    const isRestaurantOwner = req.user && restaurant.ownerId.equals(req.user._id);
    res.render("restaurant", {restaurant, foods, reviews, avgRating, avgStar, isRestaurantOwner});
}


module.exports.renderEditRestaurantForm = async (req, res) => {
    let { id } = req.params;
    const restaurant = await Restaurant.findById(`${id}`);
    if (!restaurant) {
        req.flash("error", "Restaurant doesn't exist!");
        return res.redirect("/tastebite"); // Added 'return' here
    }
    res.render("editRestaurant", { restaurant });
}

module.exports.editRestaurant = async (req, res) => {
    let { id } = req.params;
    
    let restaurant = await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant});

    if (typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename;
        restaurant.imageURL = { url, filename };
        await restaurant.save();
    }

    req.flash("success", "Restaurant Updated");
    res.redirect(`/tastebite/restaurants/${id}`)
}

module.exports.deleteRestaurant = async (req, res) => {
    let { id } = req.params;
    let deletedRestaurant = await Restaurant.findByIdAndDelete(id);
    console.log(deletedRestaurant);
    res.redirect("/tastebite");
}

module.exports.setOwnStatus = async (req, res) => {
    const { id } = req.params;
    const isActive = req.body.isActive === "true";

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) throw new ExpressError(404, "Restaurant not found.");

    // An admin suspension can only be lifted by an admin
    if (isActive && restaurant.suspendedByAdmin) {
        req.flash("error", "This restaurant was suspended by an admin. Only an admin can reactivate it.");
        return res.redirect(`/tastebite/restaurants/${id}`);
    }

    await Restaurant.findByIdAndUpdate(id, { isActive });

    req.flash(
        "success",
        isActive ? "Your restaurant is live again." : "Your restaurant is now hidden from customers."
    );
    res.redirect(`/tastebite/restaurants/${id}`);
};