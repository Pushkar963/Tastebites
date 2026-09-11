const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");

const userSchema = new Schema({
    // username and password field is automatically added in the schema by passport-local-mongoose

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },

    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },

    phoneNumber: {
        type: String,
        required: true,
        trim: true,
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
    }
},
    {
        timestamps: true     // metadata are passed as the second argument
    },

);

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);