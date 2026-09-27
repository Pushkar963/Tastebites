const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", default: null },
    items: [{
        _id: false,
        menuItemId: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
        quantity: { type: Number, required: true, min: 1 }
    }]
}, { timestamps: true });


module.exports = mongoose.model("Cart", cartSchema);
