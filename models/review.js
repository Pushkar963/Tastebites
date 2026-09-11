const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: [true, "Restaurant Id is required"],
    },

    reviewerName: {
        type: Schema.Types.ObjectId, 
        ref: "User",
        required: [true, "Reviewer Name is required"],
    },

    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot be more than 5"],
    },

    comment: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true
});

reviewSchema.index({restaurantId: 1});

module.exports = mongoose.model("Review", reviewSchema);