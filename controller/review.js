const Review = require("../models/review.js");
const Restaurant = require("../models/restaurant.js");


async function updateRestaurantRating(restaurantId) {
    const reviews = await Review.find({ restaurantId: restaurantId });
    
    let sumRating = 0;
    for (let review of reviews) {
        sumRating += review.rating;
    }
    
    let avgRating = reviews.length > 0 ? Math.floor((sumRating / reviews.length) * 10) / 10 : 0;
    let avgStar = Math.floor(avgRating);

    await Restaurant.findByIdAndUpdate(restaurantId, {
        avgRating: avgRating,
        avgStar: avgStar
    });

    await Restaurant.findByIdAndUpdate(restaurantId, {
        rating: avgRating,
        numRatings: avgStar
    });
}

module.exports.newReview = async (req, res) => {
    let { restaurantId } = req.params;
    
    if (!res.locals.currUser) {
        req.flash("error", "You must be logged in to leave a review.");
        return res.redirect("/tastebite/login");
    }

    req.body.review.restaurantId = restaurantId;
    req.body.review.reviewerName = res.locals.currUser._id;
    let newReview = new Review(req.body.review);
    await newReview.save();

    await updateRestaurantRating(restaurantId);

    console.log(newReview);
    res.redirect(`/tastebite/restaurants/${restaurantId}`);
}

module.exports.deleteReview = async (req, res) => {
    let { restaurantId, reviewId } = req.params;
    let deletedReview = await Review.findByIdAndDelete(reviewId);

    await updateRestaurantRating(restaurantId);

    console.log(deletedReview);
    res.redirect(`/tastebite/restaurants/${restaurantId}`);
}