const mongoose = require("mongoose");
const seedRestaurants = require("./seedReviews.js");
const Restaurant = require("../models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/tastebite";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => console.log("Connection Successful"))
    .catch((err) => console.log(err) );

const initDB = async () => {
    console.log(seedRestaurants.data);
    try {
        await Restaurant.deleteMany({});
        await Restaurant.insertMany(seedRestaurants.data);
        console.log("Data was intialized");
    } catch(err) {
        console.log(err);
    }
}

initDB();


