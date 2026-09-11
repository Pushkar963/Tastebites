const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuItemSchema = new Schema({
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: [true, "Restaurant Id is required"],
    },

    name: {
        type: String,
        required: [true, "Item name is required"],
        trim: true,
    },

    description: {
        type: String,
        trim: true,
    },

    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
    },

    discountedPrice: {
        type: Number,
        default: null,
        min: [0, "Discounted price cannot be negative"],
    },

    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true,
    },

    isPerishable: {
        type: Boolean,
        required: true,
        default: false,
    },

    foodType: {
        type: String,
        enum: ["VEG", "NON-VEG", "EGG"],
        required: [true, "Food type (VEG/NON-VEG/EGG) is required"],
    },

    imageUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrD4F9BllC6yvGWO7JKgr2uo9lsDpZASgvslaUYmrk5A&s=10",
        set: (v) => v === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrD4F9BllC6yvGWO7JKgr2uo9lsDpZASgvslaUYmrk5A&s=10" : v,
    },

    isAvailable: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

menuItemSchema.index({restaurantId: 1});
menuItemSchema.index({isPerishable: 1, isAvailable: 1});

module.exports = mongoose.model("MenuItem", menuItemSchema);
