const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    menuItemId: {
        type: Schema.Types.ObjectId,
        ref: "MenuItem",
        required: [true, "Menu item ID is required"],
    },

    name: {
        type: String,
        required: [true, "Item name snapshot is required"],
    },

    // Snapshot of price paid AT THE TIME OF PURCHASE (includes Surplus Hour 50% cut if applicable)
    price: {
        type: Number,
        required: [true, "Item price paid snapshot is required"],
        min: [0, "price cannot be negative"],
    },

    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
    },
});

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
    },

    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: [true, "Restaurant ID is required"],
    },

    items: {
        type: [orderItemSchema],
        required: [true, "Order must contain at least one item"],
        validate: {
            validator: function(v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: "Order items array cannot be empty",
        },
    },

    deliveryAddress: {
        streetAddress: {type: String, required: true},
        city: {type: String, required: true},
        pincode: {type: String, required: true},
        landmark: {type: String},
    }, 
    
    totalAmount: {
        type: Number,
        required: [true, "Total amount is required"],
        min: [0, "Total amount cannot be negative"],
    },

    deliveryFee: {
        type: Number,
        default: 0,
        min: [0, "Delivery Fee cannot be negative"],
    },

    paymentMethod: {
        type: String,
        enum: ["COD", "CARD", "ONLINE"],
        default: ["COD"]
    },

    paymentStatus: {
        type: String,
        enum: ["PENDING", "COMPLETED", "FAILED"],
        default: "PENDING",
    },

    orderStatus: {
        type: String,
        enum: [
            "PLACED",
            "CONFIRMED",
            "PREPARING",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED",
        ],

        default: "PLACED",
    },

    // useful for analytics to track revenue generated via Surplus Hour
    hasSurplusItems: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

orderSchema.index({userId: 1, createdAt: -1});
orderSchema.index({restaurantId: 1, orderStatus: 1});

module.exports = mongoose.model("Order", orderSchema);

