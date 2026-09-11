const Review = require("./review.js");
const MenuItem = require("./menuItem.js");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    ownerId: {
        type: Schema.Types.ObjectId,    // MongoDB ObjectId, -> ownerId: ObjectId("64abc123...")
        ref: "User",                    // This ObjectId refers to a document from the User model
        required: [true, "Owner Id is required"]
    },

    name: {
        type: String,
        required: [true, "Restaurant name is required"],
        trim: true,
    },

    cuisines: {
        type: [String],
        required: [true, "At least one cuisine type is required"],
        validate: {  // custom validator - it validates that if the array is not empty
            validator: function (v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: "Restaurant must offer at least one cuisine type",
        },
    },

    imageURL: {
        url: String,
        filename: String,
    },

    description: {
        type: String,
        trim: true,
        required: [true, "Description is required"],
    },

    address: {
        streetAddress: {
            type: String,
            required: [true, "Street Address is required"],
        },
        city: {
            type: String,
            required: [true, "City is required"],
        },
        pincode: {
            type: String,
            required: [true, "Pincode is required"],
        },
        landmark: {
            type: String
        }
    },

    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Restaurant's Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },

    rating: {        // current average score (eg: 4.5 out of 5)
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },

    numRatings: {     // total count of reviews (eg: 128 ratings)
        type: Number,
        default: 0
    },

    isOpen: {          // toggled by restaurant manager (for specific cases, like closed for lunch today)
        type: Boolean,
        default: true,
    },

    isActive: {        // toggled by TasteBite Super Admin (for the cases of business administration)
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,  
});

restaurantSchema.index({"address.city": 1});
restaurantSchema.index({cuisines: 1});
restaurantSchema.index({name: "text"});

/*
Imagine the index as the key-value pair:
Kathmandu → [Restaurant 1, Restaurant 3, Restaurant 5]
Pokhara   → [Restaurant 2]
Butwal    → [Restaurant 4]

or for cuisines, imagine it like
Indian  → [Restaurant 1, Restaurant 3]
Chinese → [Restaurant 1]
Thai    → [Restaurant 3]
Italian → [Restaurant 2]

but its bit different for name of the restaurant. First It breaks the words and then use it as keys,
MongoDB's text index can conceptually be thought of as:
"pizza"   → [Restaurant 1, Restaurant 3]
"palace"  → [Restaurant 1]
"indian"  → [Restaurant 2]
"kitchen" → [Restaurant 2]
"corner"  → [Restaurant 3]
"burger"  → [Restaurant 4]
"house"   → [Restaurant 4]
*/

// Actually its not, a key-value pair, it a B-tree-like data strucure

// One important thing: indexes make reading/searching faster, but they also consume storage and can make inserts/updates slightly slower, because MongoDB has to maintain the indexes too.




// Deleting related menuItem and the reviews of the particular restaurant on the deletion of the restaurant.
restaurantSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await Review.deleteMany({restaurantId: doc._id});
        await MenuItem.deleteMany({restaurantId: doc._id});
    }
} )

module.exports = mongoose.model("Restaurant", restaurantSchema);