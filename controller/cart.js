const Cart = require("../models/cart.js");
const Menu = require("../models/menuItem.js");

module.exports.showCart = async (req, res) => {

    try {
        let cart = await Cart.findOne({userId: req.user._id})
            .populate({
                path: "items.menuItemId", // 1. Populate the menuItemId first
                populate: { path: "restaurantId" },
            })
            .populate("restaurantId");


        const items = (cart && cart.items) ? cart.items : [];
        res.render("cart/showCart", { items });

    } catch (error) {
        console.error("Error loading cart:", error);
        res.status(500).send("Server Error");
    }
    
    
}

module.exports.addToCart = async (req, res) => {
    try {
        const { foodId, quantity = 1 } = req.body;
        const menuItem = await Menu.findById(foodId);

        if (!menuItem) {
            return res.status(404).json({ error: "Item is not available" });
        }

        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            // No cart yet — create one, tag it with this item's restaurant
            cart = new Cart({
                userId: req.user._id,
                restaurantId: menuItem.restaurantId,
                items: [{
                    menuItemId: foodId,
                    quantity: Number(quantity),
                }]
            });
        } else {
            // Cart exists — check it belongs to the same restaurant
            if (cart.items.length > 0 && !cart.restaurantId.equals(menuItem.restaurantId)) {
                return res.status(409).json({
                    error: "Your cart has items from a different restaurant. Clear your cart first to order from here."
                });
            }

            const itemIndex = cart.items.findIndex(
                (item) => item.menuItemId.toString() === foodId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += Number(quantity);
            } else {
                cart.items.push({ menuItemId: foodId, quantity: Number(quantity) });
            }

            // Cart was empty before this add — (re)assign its restaurant
            if (cart.items.length === 1) {
                cart.restaurantId = menuItem.restaurantId;
            }
        }

        const savedCart = await cart.save();
        return res.status(200).json({ message: "Item added to cart", cart: savedCart });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports.editCart = async (req, res) => {
    try {
        const { foodId, action } = req.body;
        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.menuItemId.toString() === foodId
        );

        if (itemIndex > -1) {
            if (action === "increase") {
                cart.items[itemIndex].quantity += 1;
            } else if (action === "decrease") {
                cart.items[itemIndex].quantity -= 1;

                // Remove item if quantity falls to 0 or below
                if (cart.items[itemIndex].quantity <= 0) {
                    cart.items.splice(itemIndex, 1);
                }
            }

            // Reset restaurant lock once the cart is fully empty
            if (cart.items.length === 0) {
                cart.restaurantId = null;
            }

            // Save the updated cart array to MongoDB
            await cart.save();

            return res.status(200).json({ 
                success: true, 
                message: "Cart updated successfully", 
                cart 
            });
        }

        return res.status(404).json({ message: "Item not found in cart" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


module.exports.deleteItemFromCart = async (req, res) => {
    try {
        const { foodId } = req.params;

        const cart = await Cart.findOneAndUpdate(
            { userId: req.user._id },
            { $pull: { items: { menuItemId: foodId } } },
            { new: true }
        );

        // Reset restaurant lock once the cart is fully empty
        if (cart && cart.items.length === 0) {
            cart.restaurantId = null;
            await cart.save();
        }

        res.redirect("/tastebite/cart");
    } catch (error) {
        res.status(500).send(error.message);
    }
    
}



/*
=========================================
Render checkout
=========================================
*/

module.exports.renderCheckout = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate("items.menuItemId");

        // 1. Cart must not be empty
        if (!cart || cart.items.length === 0) {
            req.flash("error", "Your cart is empty.");
            return res.redirect("/tastebite/cart");
        }

        // 2. Re-verify every item still exists and is available
        const unavailableItems = [];
        for (const item of cart.items) {
            if (!item.menuItemId || item.menuItemId.isAvailable === false) {
                unavailableItems.push(item.menuItemId ? item.menuItemId.name : "An item");
            }
        }

        if (unavailableItems.length > 0) {
            req.flash("error", `These items are no longer available: ${unavailableItems.join(", ")}. Please remove them to continue.`);
            return res.redirect("/tastebite/cart");
        }

        // 3. Recompute totals server-side, never trust client-sent prices
        let itemTotal = 0;
        const checkoutItems = cart.items.map((item) => {
            const menuItem = item.menuItemId;
            const unitPrice = menuItem.discountedPrice ?? menuItem.price;
            const lineTotal = unitPrice * item.quantity;
            itemTotal += lineTotal;

            return {
                menuItemId: menuItem._id,
                name: menuItem.name,
                price: unitPrice,
                quantity: item.quantity,
                lineTotal,
            };
        });

        const deliveryFee = 2.99;
        const totalAmount = itemTotal + deliveryFee;

        // 4. Confirm delivery address exists
        const deliveryAddress = req.user.address;
        if (!deliveryAddress || !deliveryAddress.streetAddress) {
            req.flash("error", "Please add a delivery address to your profile before checking out.");
            return res.redirect("/tastebite/profile");
        }

        // All checks passed — render a checkout confirmation page (Stripe comes next)
        res.render("cart/checkout", {
            checkoutItems,
            itemTotal,
            deliveryFee,
            totalAmount,
            deliveryAddress,
            restaurantId: cart.restaurantId,
        });

    } catch (error) {
        console.error("Checkout error:", error);
        req.flash("error", "Something went wrong during checkout.");
        res.redirect("/tastebite/cart");
    }
};