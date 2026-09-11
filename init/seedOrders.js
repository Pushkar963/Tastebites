const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const orders = [
    // ============================================================
    // ORDER 1
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc1999360801e"), // john_doe
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e48405e"), // Malibu Coastal Kitchen

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db4f"),
                name: "Classic Cheeseburger",
                price: 10.99,
                quantity: 2
            },
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db51"),
                name: "Caesar Salad",
                price: 7.49,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "123 Ocean Avenue",
            city: "Malibu",
            pincode: "90265",
            landmark: "Near Malibu Beach"
        },

        totalAmount: 29.47,
        deliveryFee: 3.99,
        paymentMethod: "CARD",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        hasSurplusItems: false
    },

    // ============================================================
    // ORDER 2
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc1999360801f"), // emma_wilson
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e48405f"), // Broadway Spice House

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db52"),
                name: "Butter Chicken",
                price: 13.99,
                quantity: 1
            },
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db53"),
                name: "Vegetable Hakka Noodles",
                price: 11.99,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "45 Broadway",
            city: "New York City",
            pincode: "10006",
            landmark: "Near Wall Street"
        },

        totalAmount: 25.98,
        deliveryFee: 4.49,
        paymentMethod: "ONLINE",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        hasSurplusItems: false
    },

    // ============================================================
    // ORDER 3 - SURPLUS
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc19993608020"), // oliver_smith
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484060"), // Mountain Hearth

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db56"),
                name: "Mountain Steak",
                price: 9.995,
                quantity: 1
            },
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db57"),
                name: "Mushroom Risotto",
                price: 7.745,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "78 Mountain Road",
            city: "Aspen",
            pincode: "81611",
            landmark: "Near Aspen Mountain"
        },

        totalAmount: 17.74,
        deliveryFee: 4.99,
        paymentMethod: "CARD",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        hasSurplusItems: true
    },

    // ============================================================
    // ORDER 4
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc19993608021"), // sophia_martin
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484061"), // La Tavola Fiorentina

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db58"),
                name: "Spaghetti Carbonara",
                price: 16.99,
                quantity: 1
            },
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db59"),
                name: "Margherita Pizza",
                price: 11.99,
                quantity: 1
            },
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db5a"),
                name: "Tiramisu",
                price: 7.99,
                quantity: 2
            }
        ],

        deliveryAddress: {
            streetAddress: "12 Via Roma",
            city: "Florence",
            pincode: "50121",
            landmark: "Near Piazza della Signoria"
        },

        totalAmount: 44.96,
        deliveryFee: 3.99,
        paymentMethod: "ONLINE",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        hasSurplusItems: false
    },

    // ============================================================
    // ORDER 5
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc19993608022"), // liam_johnson
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484062"), // Forest & Fork

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db5b"),
                name: "BBQ Bacon Burger",
                price: 12.99,
                quantity: 1
            },
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db5d"),
                name: "Loaded Nachos",
                price: 9.99,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "89 Forest Avenue",
            city: "Portland",
            pincode: "97205",
            landmark: "Near Washington Park"
        },

        totalAmount: 22.98,
        deliveryFee: 3.49,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        orderStatus: "PLACED",
        hasSurplusItems: false
    },

    // ============================================================
    // ORDER 6 - SURPLUS
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc19993608023"), // ava_brown
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484063"), // Caribbean Breeze

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db5e"),
                name: "Caribbean Fish Tacos",
                price: 6.495,
                quantity: 2
            },
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db60"),
                name: "Mango Salsa",
                price: 3.245,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "56 Avenida Kukulkan",
            city: "Cancun",
            pincode: "77500",
            landmark: "Near Hotel Zone"
        },

        totalAmount: 16.235,
        deliveryFee: 3.99,
        paymentMethod: "ONLINE",
        paymentStatus: "COMPLETED",
        orderStatus: "CONFIRMED",
        hasSurplusItems: true
    },

    // ============================================================
    // ORDER 7
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc19993608024"), // noah_davis
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484064"), // Lakeside Grill

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db61"),
                name: "Smoky BBQ Ribs",
                price: 18.99,
                quantity: 1
            },
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db62"),
                name: "Grilled Chicken Plate",
                price: 15.99,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "34 Lakeview Drive",
            city: "Lake Tahoe",
            pincode: "96145",
            landmark: "Near Lake Tahoe"
        },

        totalAmount: 34.98,
        deliveryFee: 4.49,
        paymentMethod: "CARD",
        paymentStatus: "COMPLETED",
        orderStatus: "PREPARING",
        hasSurplusItems: false
    },

    // ============================================================
    // ORDER 8
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc19993608025"), // isabella_miller
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e48405e"), // Malibu Coastal Kitchen

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db50"),
                name: "Grilled Salmon",
                price: 18.99,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "210 Sunset Boulevard",
            city: "Los Angeles",
            pincode: "90028",
            landmark: "Near Hollywood"
        },

        totalAmount: 18.99,
        deliveryFee: 5.49,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        orderStatus: "PLACED",
        hasSurplusItems: false
    },

    // ============================================================
    // ORDER 9 - SURPLUS
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc19993608026"), // james_wilson
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484060"), // Mountain Hearth

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db55"),
                name: "Wood-Fired Pasta",
                price: 7.495,
                quantity: 2
            }
        ],

        deliveryAddress: {
            streetAddress: "25 Alpine Road",
            city: "Verbier",
            pincode: "1936",
            landmark: "Near Verbier Ski Resort"
        },

        totalAmount: 14.99,
        deliveryFee: 4.99,
        paymentMethod: "ONLINE",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        hasSurplusItems: true
    },

    // ============================================================
    // ORDER 10
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc19993608027"), // mia_taylor
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484061"), // La Tavola Fiorentina

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db59"),
                name: "Margherita Pizza",
                price: 11.99,
                quantity: 2
            }
        ],

        deliveryAddress: {
            streetAddress: "17 Safari Lane",
            city: "Serengeti National Park",
            pincode: "23100",
            landmark: "Near Serengeti Visitor Centre"
        },

        totalAmount: 23.98,
        deliveryFee: 5.99,
        paymentMethod: "CARD",
        paymentStatus: "COMPLETED",
        orderStatus: "OUT_FOR_DELIVERY",
        hasSurplusItems: false
    },

    // ============================================================
    // ORDER 11
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc19993608028"), // benjamin_anderson
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484062"), // Forest & Fork

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db5c"),
                name: "Chicken Tacos",
                price: 11.49,
                quantity: 2
            }
        ],

        deliveryAddress: {
            streetAddress: "88 Canal Street",
            city: "Amsterdam",
            pincode: "1012",
            landmark: "Near Dam Square"
        },

        totalAmount: 22.98,
        deliveryFee: 4.49,
        paymentMethod: "ONLINE",
        paymentStatus: "COMPLETED",
        orderStatus: "CONFIRMED",
        hasSurplusItems: false
    },

    // ============================================================
    // ORDER 12 - SURPLUS
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc19993608029"), // charlotte_thomas
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484063"), // Caribbean Breeze

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db5f"),
                name: "Shrimp Rice Bowl",
                price: 8.245,
                quantity: 1
            },
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db60"),
                name: "Mango Salsa",
                price: 3.245,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "10 Island Road",
            city: "Fiji",
            pincode: "679",
            landmark: "Near Nadi Bay"
        },

        totalAmount: 11.49,
        deliveryFee: 3.99,
        paymentMethod: "CARD",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        hasSurplusItems: true
    },

    // ============================================================
    // ORDER 13
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc1999360802a"), // lucas_jackson
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e48405f"),

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db4f"),
                name: "Classic Cheeseburger",
                price: 10.99,
                quantity: 1
            },
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db50"),
                name: "Grilled Salmon",
                price: 18.99,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "42 Cotswold Lane",
            city: "Cotswolds",
            pincode: "GL54",
            landmark: "Near Bourton-on-the-Water"
        },

        totalAmount: 29.98,
        deliveryFee: 4.99,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        orderStatus: "CANCELLED",
        hasSurplusItems: false
    },

    // ============================================================
    // ORDER 14
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc1999360802b"), // amelia_white
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484061"),

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db5a"),
                name: "Tiramisu",
                price: 7.99,
                quantity: 2
            },
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db59"),
                name: "Margherita Pizza",
                price: 11.99,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "76 Beacon Street",
            city: "Boston",
            pincode: "02108",
            landmark: "Near Boston Common"
        },

        totalAmount: 27.97,
        deliveryFee: 3.49,
        paymentMethod: "ONLINE",
        paymentStatus: "COMPLETED",
        orderStatus: "PREPARING",
        hasSurplusItems: false
    },

    // ============================================================
    // ORDER 15 - SURPLUS
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc1999360802c"), // henry_harris
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484062"),

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db5b"),
                name: "BBQ Bacon Burger",
                price: 6.495,
                quantity: 1
            },
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db5d"),
                name: "Loaded Nachos",
                price: 4.995,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "21 Beach Road",
            city: "Bali",
            pincode: "80361",
            landmark: "Near Seminyak Beach"
        },

        totalAmount: 11.49,
        deliveryFee: 3.99,
        paymentMethod: "ONLINE",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        hasSurplusItems: true
    },

    // ============================================================
    // ORDER 16
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc1999360802d"), // harper_martin
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484064"),

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db61"),
                name: "Smoky BBQ Ribs",
                price: 18.99,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "63 Mountain Avenue",
            city: "Banff",
            pincode: "T1L",
            landmark: "Near Banff National Park"
        },

        totalAmount: 18.99,
        deliveryFee: 4.99,
        paymentMethod: "CARD",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        hasSurplusItems: false
    },

    // ============================================================
    // ORDER 17
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc1999360802e"), // alexander_thompson
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e48405f"),

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db52"),
                name: "Butter Chicken",
                price: 13.99,
                quantity: 2
            }
        ],

        deliveryAddress: {
            streetAddress: "95 Ocean Drive",
            city: "Miami",
            pincode: "33139",
            landmark: "Near South Beach"
        },

        totalAmount: 27.98,
        deliveryFee: 4.99,
        paymentMethod: "CARD",
        paymentStatus: "COMPLETED",
        orderStatus: "OUT_FOR_DELIVERY",
        hasSurplusItems: false
    },

    // ============================================================
    // ORDER 18 - SURPLUS
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc1999360802f"), // evelyn_garcia
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484060"),

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db56"),
                name: "Mountain Steak",
                price: 9.995,
                quantity: 2
            }
        ],

        deliveryAddress: {
            streetAddress: "38 Tropical Road",
            city: "Phuket",
            pincode: "83110",
            landmark: "Near Patong Beach"
        },

        totalAmount: 19.99,
        deliveryFee: 4.99,
        paymentMethod: "ONLINE",
        paymentStatus: "COMPLETED",
        orderStatus: "PREPARING",
        hasSurplusItems: true
    },

    // ============================================================
    // ORDER 19
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc1999360801e"), // john_doe
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484061"),

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db58"),
                name: "Spaghetti Carbonara",
                price: 16.99,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "123 Ocean Avenue",
            city: "Malibu",
            pincode: "90265",
            landmark: "Near Malibu Beach"
        },

        totalAmount: 16.99,
        deliveryFee: 3.99,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        orderStatus: "CONFIRMED",
        hasSurplusItems: false
    },

    // ============================================================
    // ORDER 20
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc1999360801f"), // emma_wilson
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484063"),

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db5e"),
                name: "Caribbean Fish Tacos",
                price: 12.99,
                quantity: 1
            },
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db60"),
                name: "Mango Salsa",
                price: 6.49,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "45 Broadway",
            city: "New York City",
            pincode: "10006",
            landmark: "Near Wall Street"
        },

        totalAmount: 19.48,
        deliveryFee: 4.49,
        paymentMethod: "CARD",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        hasSurplusItems: false
    },

    // ============================================================
    // ORDER 21 - SURPLUS
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc19993608020"), // oliver_smith
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484061"),

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db5a"),
                name: "Tiramisu",
                price: 3.995,
                quantity: 2
            },
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db59"),
                name: "Margherita Pizza",
                price: 5.995,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "78 Mountain Road",
            city: "Aspen",
            pincode: "81611",
            landmark: "Near Aspen Mountain"
        },

        totalAmount: 13.985,
        deliveryFee: 3.99,
        paymentMethod: "ONLINE",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        hasSurplusItems: true
    },

    // ============================================================
    // ORDER 22
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc19993608021"), // sophia_martin
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484062"),

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db5c"),
                name: "Chicken Tacos",
                price: 11.49,
                quantity: 1
            },
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db5d"),
                name: "Loaded Nachos",
                price: 9.99,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "12 Via Roma",
            city: "Florence",
            pincode: "50121",
            landmark: "Near Piazza della Signoria"
        },

        totalAmount: 21.48,
        deliveryFee: 3.99,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        orderStatus: "PLACED",
        hasSurplusItems: false
    },

    // ============================================================
    // ORDER 23
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc19993608022"), // liam_johnson
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e484064"),

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db62"),
                name: "Grilled Chicken Plate",
                price: 15.99,
                quantity: 2
            }
        ],

        deliveryAddress: {
            streetAddress: "89 Forest Avenue",
            city: "Portland",
            pincode: "97205",
            landmark: "Near Washington Park"
        },

        totalAmount: 31.98,
        deliveryFee: 4.49,
        paymentMethod: "CARD",
        paymentStatus: "COMPLETED",
        orderStatus: "OUT_FOR_DELIVERY",
        hasSurplusItems: false
    },

    // ============================================================
    // ORDER 24 - SURPLUS
    // ============================================================
    {
        userId: new mongoose.Types.ObjectId("6a7cac86b8bdc19993608023"), // ava_brown
        restaurantId: new mongoose.Types.ObjectId("6a7d8f13e3400f318e48405e"),

        items: [
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db4f"),
                name: "Classic Cheeseburger",
                price: 5.495,
                quantity: 1
            },
            {
                menuItemId: new mongoose.Types.ObjectId("6a7d94397df7a57bbbf1db51"),
                name: "Caesar Salad",
                price: 3.745,
                quantity: 1
            }
        ],

        deliveryAddress: {
            streetAddress: "56 Avenida Kukulkan",
            city: "Cancun",
            pincode: "77500",
            landmark: "Near Hotel Zone"
        },

        totalAmount: 9.24,
        deliveryFee: 3.99,
        paymentMethod: "ONLINE",
        paymentStatus: "COMPLETED",
        orderStatus: "CONFIRMED",
        hasSurplusItems: true
    }
];


module.exports = { data: orders};