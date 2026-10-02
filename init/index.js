require("dotenv").config();
const mongoose = require("mongoose");

const User = require("../models/user.js");
const Restaurant = require("../models/restaurant.js");
const MenuItem = require("../models/menuItem.js");
const Review = require("../models/review.js");

const seedUsers = require("./seedUsers.js");
const seedRestaurants = require("./seedRestaurants.js");
const seedMenuItems = require("./seedMenuItem.js");

const MONGO_URL = process.env.ATLASDB_URL;
if (!MONGO_URL) throw new Error("ATLASDB_URL not found. Run from the project root: node init/index.js");

const initDB = async () => {
  await mongoose.connect(MONGO_URL);
  console.log("Seeding ->", mongoose.connection.host, "| db:", mongoose.connection.name);
  console.log("Connection successful");

  // ---------- 1. Clean up old seeded data (your real data is untouched) ----------
  const restaurantEmails = seedRestaurants.data.map((r) => r.email);
  const oldRestaurants = await Restaurant.find({ email: { $in: restaurantEmails } });
  const oldIds = oldRestaurants.map((r) => r._id);

  // deleteMany() does NOT trigger your post("findOneAndDelete") hook, so clean children manually
  await MenuItem.deleteMany({ restaurantId: { $in: oldIds } });
  await Review.deleteMany({ restaurantId: { $in: oldIds } });
  await Restaurant.deleteMany({ _id: { $in: oldIds } });

  const usernames = seedUsers.data.map((u) => u.username);
  const userEmails = seedUsers.data.map((u) => u.email);
  await User.deleteMany({
    $or: [{ username: { $in: usernames } }, { email: { $in: userEmails } }],
  });

  // ---------- 2. Users ----------
  const createdUsers = [];
  for (const userData of seedUsers.data) {
    const { password, ...rest } = userData;
    const user = await User.register(new User(rest), password);
    createdUsers.push(user);
    console.log(`User created: ${rest.username}`);
  }

   // ---------- 3. Restaurants (owner = user at the same index) ----------
  const createdRestaurants = [];
  for (let i = 0; i < seedRestaurants.data.length; i++) {
    const restaurantData = {
      ...seedRestaurants.data[i],
      ownerId: createdUsers[i]._id,
    };
    const restaurant = await Restaurant.create(restaurantData);
    createdRestaurants.push(restaurant);
    console.log(`Restaurant created: ${restaurantData.name} (owner: ${createdUsers[i].username})`);
  }

    // ---------- 4. Menu items ----------
  // Map each old hardcoded restaurantId -> the new restaurant created at the same position
  const idMap = new Map();
  for (const item of seedMenuItems.data) {
    const oldId = item.restaurantId.toString();
    if (!idMap.has(oldId)) {
      const restaurant = createdRestaurants[idMap.size];
      if (!restaurant) throw new Error("More distinct restaurantIds in menu data than restaurants");
      idMap.set(oldId, restaurant._id);
    }
  }

  const menuItems = seedMenuItems.data.map((item) => ({
    ...item,
    restaurantId: idMap.get(item.restaurantId.toString()),
    imageUrl: `${item.imageUrl}?w=600&q=80`, // smaller, faster images
  }));

  await MenuItem.insertMany(menuItems);
  console.log(`${menuItems.length} menu items created`);

  console.log("All users, restaurants and menu items seeded");
};

initDB()
  .catch((err) => console.log(err))
  .finally(() => mongoose.connection.close());