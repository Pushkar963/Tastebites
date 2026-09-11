const Review = require("../models/review.js");

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
    console.log(newReview);
    res.redirect(`/tastebite/restaurants/${restaurantId}`);
}

module.exports.deleteReview = async (req, res) => {
    let { restaurantId, reviewId } = req.params;
    let deletedReview = await Review.findByIdAndDelete(reviewId);
    console.log(deletedReview);
    res.redirect(`/tastebite/restaurants/${restaurantId}`);
}