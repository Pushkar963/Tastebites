const Cart = require("../models/cart.js");
const Menu = require("../models/menuItem.js");
const Order = require("../models/order.js");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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


module.exports.createCheckoutSession = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate("items.menuItemId");

        if (!cart || cart.items.length === 0) {
            req.flash("error", "Your cart is empty.");
            return res.redirect("/tastebite/cart");
        }

        const line_items = cart.items.map((item) => {
            const menuItem = item.menuItemId;
            const unitPrice = menuItem.discountedPrice ?? menuItem.price;

            return {
                price_data: {
                    currency: "usd",
                    product_data: { name: menuItem.name },
                    unit_amount: Math.round(unitPrice * 100), // Stripe wants cents
                },
                quantity: item.quantity,
            };
        });

        // delivery fee as its own line item
        line_items.push({
            price_data: {
                currency: "usd",
                product_data: { name: "Delivery Fee" },
                unit_amount: Math.round(2.99 * 100),
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items,
            success_url: `${req.protocol}://${req.get("host")}/tastebite/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get("host")}/tastebite/checkout/cancel`,
            metadata: { userId: req.user._id.toString() },
        });

        res.redirect(303, session.url);

    } catch (error) {
        console.error("Stripe session error:", error);
        req.flash("error", "Something went wrong starting payment.");
        res.redirect("/tastebite/cart");
    }
};


module.exports.checkoutSuccess = async (req, res) => {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            req.flash("error", "Missing payment session.");
            return res.redirect("/tastebite/cart");
        }

        // Retrieve the session fresh from Stripe — never trust the redirect alone
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== "paid") {
            req.flash("error", "Payment was not completed.");
            return res.redirect("/tastebite/cart");
        }

        // Guard against duplicate Order creation if user refreshes /success
        const existingOrder = await Order.findOne({ stripeSessionId: session_id });
        if (existingOrder) {
            return res.render("cart/orderConfirmation", { order: existingOrder });
        }

        // Re-fetch cart fresh — same pattern as renderCheckout/createCheckoutSession
        const cart = await Cart.findOne({ userId: req.user._id }).populate("items.menuItemId");

        if (!cart || cart.items.length === 0) {
            // Cart already emptied (e.g. user refreshed this page after success)
            req.flash("error", "No active order found.");
            return res.redirect("/tastebite/cart");
        }

        let itemTotal = 0;
        const orderItems = cart.items.map((item) => {
            const menuItem = item.menuItemId;
            const unitPrice = menuItem.discountedPrice ?? menuItem.price;
            itemTotal += unitPrice * item.quantity;

            return {
                menuItemId: menuItem._id,
                name: menuItem.name,
                price: unitPrice,
                quantity: item.quantity,
            };
        });

        const deliveryFee = 2.99;

        const order = await Order.create({
            userId: req.user._id,
            restaurantId: cart.restaurantId,
            items: orderItems,
            deliveryAddress: req.user.address,
            totalAmount: itemTotal + deliveryFee,
            deliveryFee,
            paymentMethod: "ONLINE",
            paymentStatus: "COMPLETED",
            orderStatus: "PLACED",
            stripeSessionId: session_id,
        });

        // Empty the cart
        cart.items = [];
        cart.restaurantId = null;
        await cart.save();

        res.render("cart/orderConfirmation", { order });

    } catch (error) {
        console.error("Checkout success error:", error);
        req.flash("error", "Something went wrong confirming your order.");
        res.redirect("/tastebite/cart");
    }
};

module.exports.checkoutCancel = (req, res) => {
    req.flash("error", "Payment was cancelled.");
    res.redirect("/tastebite/cart");
};
