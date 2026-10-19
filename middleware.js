const Restaurant = require("./models/restaurant.js");
const Review = require("./models/review.js");
const menuItemSchema = require("./schemas/menuItemSchema.js");    // joi validation
const restaurantSchema = require("./schemas/restaurantSchema.js");   // joi validation
const reviewSchema = require("./schemas/reviewSchema.js"); // joi validation
const ExpressError = require("./utils/ExpressError.js");
const crypto = require("crypto");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.method === "GET") req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login to add a new menu item");
        return res.redirect(`/tastebite/login`);
    }
    next();
}

module.exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "ADMIN") {
        req.flash("error", "Admins only.");
        return res.redirect("/tastebite");
    }
    next();
};

// since passports resets req.session after the access of /login route and receiving the success message from the passport.authenticate(), therefore we save it to the locals, and locals are those variable which are accessible everywhere

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
}



// creating a middlware to prevent the restaurant to get tampered by other user apart from the owner
module.exports.isOwner = async (req, res, next) => {
        let { id } = req.params;
        let restaurant = await Restaurant.findById(id);
        const currentUser = res.locals.currUser;

        if (!currentUser || !restaurant.ownerId._id.equals(currentUser._id)) {
            req.flash("error", "You are not the authorized owner");
            return res.redirect(`/tastebite/restaurants/${id}`);
        }
        next();
};

// Middleware for parsing HTML checkboxes into Booleans before Joi runs
module.exports.sanitizeBody = (req, res, next) => {
    if (req.body.restaurant) {
        req.body.restaurant.isOpen = req.body.restaurant.isOpen === "on";
    }
    if (req.body.menuItem) {
        req.body.menuItem.isAvailable = req.body.menuItem.isAvailable === "on";
        req.body.menuItem.isPerishable = req.body.menuItem.isPerishable === "on";
    }
    next();
};


module.exports.validateRestaurant = (req, res, next) => {
    let { error } = restaurantSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg); 
    } else {
        next();
    }
}

module.exports.validateMenuItem = (req, res, next) => {
    let { error } = menuItemSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { restaurantId, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if(!review.reviewerName.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/tastebite/restaurants/${restaurantId}`);
    }
    next();
}

module.exports.csrfProtection = (req, res, next) => {
    // 1) every session gets one random token
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString("hex");
    }
    res.locals.csrfToken = req.session.csrfToken;

    // 2) reading pages never changes data: skip
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

    // 3) compare the token that was sent with the one in the session
    const sent = (req.body && req.body._csrf) || req.query._csrf || req.get("x-csrf-token") || "";
    const a = Buffer.from(String(sent));
    const b = Buffer.from(req.session.csrfToken);

    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return next(new ExpressError(403, "This page expired or the request was not valid. Refresh the page and try again."));
    }
    if (req.body) delete req.body._csrf;
    next();
};