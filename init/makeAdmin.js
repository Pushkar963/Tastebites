require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user.js");

// Use the SAME connection string your app.js uses
const DB_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/tastebite";

async function makeAdmin(email) {
    await mongoose.connect(DB_URL);

    const user = await User.findOneAndUpdate(
        { email: email.toLowerCase() },     // 1) FILTER  – which user?
        { role: "ADMIN" },                  // 2) UPDATE  – what to change?
        { new: true, runValidators: true }  // 3) OPTIONS – how to behave?
    );

    if (!user) {
        console.log(`No user found with email: ${email}`);
    } else {
        console.log(`${user.username} is now ${user.role}`);
    }

    await mongoose.disconnect();
}

const email = process.argv[2];
if (!email) {
    console.log("Usage: node init/makeAdmin.js <email>");
    process.exit(1);
}

makeAdmin(email);