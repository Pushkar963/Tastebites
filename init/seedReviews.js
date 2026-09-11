const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const sampleReviews = [
  {
    _id: new ObjectId("6aa17741c254ba2f0a7f73e3"),
    restaurantId: new ObjectId("6aa2ebcf8e3233809a86ff39"),
    reviewerName: new ObjectId("6a7cac86b8bdc1999360801e"),
    rating: 5,
    comment: "Amazing food and a beautiful atmosphere. The pizza was fresh and full of flavor.",
    __v: 0,
    createdAt: new Date("2026-09-09T15:12:01.317Z"),
    updatedAt: new Date("2026-09-09T15:12:01.317Z")
  },
  {
    _id: new ObjectId("6aa17741c254ba2f0a7f73e4"),
    restaurantId: new ObjectId("6aa2ebcf8e3233809a86ff39"),
    reviewerName: new ObjectId("6a7cac86b8bdc1999360801f"),
    rating: 4,
    comment: "Really tasty food with plenty of flavor. The service was good and the place had a nice atmosphere.",
    __v: 0,
    createdAt: new Date("2026-09-09T15:12:01.317Z"),
    updatedAt: new Date("2026-09-09T15:12:01.317Z")
  },
  {
    _id: new ObjectId("6aa17741c254ba2f0a7f73e5"),
    restaurantId: new ObjectId("6aa2ebcf8e3233809a86ff39"),
    reviewerName: new ObjectId("6a7cac86b8bdc19993608020"),
    rating: 5,
    comment: "The handmade pasta was excellent. Very cozy restaurant and perfect for a relaxing dinner.",
    __v: 0,
    createdAt: new Date("2026-09-09T15:12:01.317Z"),
    updatedAt: new Date("2026-09-09T15:12:01.317Z")
  },
  {
    _id: new ObjectId("6aa17741c254ba2f0a7f73e6"),
    restaurantId: new ObjectId("6aa2ebcf8e3233809a86ff39"),
    reviewerName: new ObjectId("6a7cac86b8bdc19993608021"),
    rating: 5,
    comment: "Authentic Italian flavors and delicious pasta. The dessert was also fantastic.",
    __v: 0,
    createdAt: new Date("2026-09-09T15:12:01.317Z"),
    updatedAt: new Date("2026-09-09T15:12:01.317Z")
  },
  {
    _id: new ObjectId("6aa17741c254ba2f0a7f73e7"),
    restaurantId: new ObjectId("6aa2ebcf8e3233809a86ff39"),
    reviewerName: new ObjectId("6a7cac86b8bdc19993608022"),
    rating: 4,
    comment: "Great burgers and tacos. Portions were generous and the food arrived quickly.",
    __v: 0,
    createdAt: new Date("2026-09-09T15:12:01.317Z"),
    updatedAt: new Date("2026-09-09T15:12:01.317Z")
  },
  {
    _id: new ObjectId("6aa17741c254ba2f0a7f73e8"),
    restaurantId: new ObjectId("6aa2ebcf8e3233809a86ff39"),
    reviewerName: new ObjectId("6a7cac86b8bdc19993608023"),
    rating: 5,
    comment: "Loved the seafood here. Everything tasted fresh and the tropical atmosphere was wonderful.",
    __v: 0,
    createdAt: new Date("2026-09-09T15:12:01.317Z"),
    updatedAt: new Date("2026-09-09T15:12:01.317Z")
  },
  {
    _id: new ObjectId("6aa17741c254ba2f0a7f73e9"),
    restaurantId: new ObjectId("6aa2ebcf8e3233809a86ff39"),
    reviewerName: new ObjectId("6a7cac86b8bdc19993608024"),
    rating: 4,
    comment: "The barbecue was smoky and delicious. The portions were filling and the view was great.",
    __v: 0,
    createdAt: new Date("2026-09-09T15:12:01.317Z"),
    updatedAt: new Date("2026-09-09T15:12:01.317Z")
  },
  {
    _id: new ObjectId("6aa17741c254ba2f0a7f73ea"),
    restaurantId: new ObjectId("6aa2ebcf8e3233809a86ff39"),
    reviewerName: new ObjectId("6a7cac86b8bdc19993608025"),
    rating: 3,
    comment: "The burgers were decent and the fries were good, but the service was a little slow.",
    __v: 0,
    createdAt: new Date("2026-09-09T15:12:01.317Z"),
    updatedAt: new Date("2026-09-09T15:12:01.317Z")
  },
  {
    _id: new ObjectId("6aa17741c254ba2f0a7f73eb"),
    restaurantId: new ObjectId("6aa2ebcf8e3233809a86ff39"),
    reviewerName: new ObjectId("6a7cac86b8bdc19993608026"),
    rating: 5,
    comment: "Wonderful mountain dining experience. The food was hearty, warm, and very flavorful.",
    __v: 0,
    createdAt: new Date("2026-09-09T15:12:01.317Z"),
    updatedAt: new Date("2026-09-09T15:12:01.317Z")
  },
  {
    _id: new ObjectId("6aa17741c254ba2f0a7f73ec"),
    restaurantId: new ObjectId("6aa2ebcf8e3233809a86ff39"),
    reviewerName: new ObjectId("6a7cac86b8bdc19993608027"),
    rating: 4,
    comment: "A unique dining experience with delicious grilled dishes. Definitely worth trying.",
    __v: 0,
    createdAt: new Date("2026-09-09T15:12:01.317Z"),
    updatedAt: new Date("2026-09-09T15:12:01.317Z")
  },
  {
    _id: new ObjectId("6aa17741c254ba2f0a7f73ed"),
    restaurantId: new ObjectId("6aa2ebcf8e3233809a86ff39"),
    reviewerName: new ObjectId("6a7cac86b8bdc19993608028"),
    rating: 4,
    comment: "Stylish restaurant with tasty European dishes. The atmosphere was excellent.",
    __v: 0,
    createdAt: new Date("2026-09-09T15:12:01.317Z"),
    updatedAt: new Date("2026-09-09T15:12:01.317Z")
  },
  {
    _id: new ObjectId("6aa17741c254ba2f0a7f73ee"),
    restaurantId: new ObjectId("6aa2ebcf8e3233809a86ff39"),
    reviewerName: new ObjectId("6a7cac86b8bdc19993608029"),
    rating: 5,
    comment: "The seafood was incredibly fresh and the island-inspired flavors were delicious.",
    __v: 0,
    createdAt: new Date("2026-09-09T15:12:01.317Z"),
    updatedAt: new Date("2026-09-09T15:12:01.317Z")
  },
  {
    _id: new ObjectId("6aa17741c254ba2f0a7f73ef"),
    restaurantId: new ObjectId("6aa2ebcf8e3233809a86ff39"),
    reviewerName: new ObjectId("6a7cac86b8bdc1999360802a"),
    rating: 5,
    comment: "Loved the traditional British food. Everything was comforting and well prepared.",
    __v: 0,
    createdAt: new Date("2026-09-09T15:12:01.317Z"),
    updatedAt: new Date("2026-09-09T15:12:01.317Z")
  },
  {
    _id: new ObjectId("6aa17741c254ba2f0a7f73f0"),
    restaurantId: new ObjectId("6aa2ebcf8e3233809a86ff39"),
    reviewerName: new ObjectId("6a7cac86b8bdc1999360802b"),
    rating: 4,
    comment: "Great coffee and fresh pastries. A cozy place to relax and have breakfast.",
    __v: 0,
    createdAt: new Date("2026-09-09T15:12:01.317Z"),
    updatedAt: new Date("2026-09-09T15:12:01.317Z")
  },
  {
    _id: new ObjectId("6aa17741c254ba2f0a7f73f1"),
    restaurantId: new ObjectId("6aa2ebcf8e3233809a86ff39"),
    reviewerName: new ObjectId("6a7cac86b8bdc1999360802c"),
    rating: 5,
    comment: "Beautiful restaurant with authentic Indonesian food. The seafood was fresh and flavorful.",
    __v: 0,
    createdAt: new Date("2026-09-09T15:12:01.317Z"),
    updatedAt: new Date("2026-09-09T15:12:01.317Z")
  }
];

module.exports = { data: sampleReviews };