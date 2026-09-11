const express = require('express');
const router = express.Router({mergeParams: true});

const asyncWrap = require("../utils/asyncWrap.js");
const reviewController = require("../controller/review.js");


const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");



// Add New Review route
router.post("/", isLoggedIn, validateReview, asyncWrap (reviewController.newReview));

// Delete a review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewController.deleteReview);


module.exports = router;