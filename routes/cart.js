const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const { isLoggedIn } = require("../middleware.js");

const cartController = require("../controller/cart.js");


router.get("/cart", isLoggedIn, asyncWrap(cartController.showCart));

router.post("/cart/add", isLoggedIn, asyncWrap(cartController.addToCart));

router.put("/cart/update", isLoggedIn, asyncWrap(cartController.editCart));

router.delete("/cart/:foodId", isLoggedIn, asyncWrap(cartController.deleteItemFromCart));

router.get("/checkout", asyncWrap(cartController.renderCheckout));

module.exports = router;