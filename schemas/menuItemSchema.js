const Joi = require("joi");


const menuItemSchema = Joi.object({
    menuItem : Joi.object({
        name: Joi.string().trim().required(),
        description: Joi.string(),
        price: Joi.number().min(0).required(),
        discountedPrice: Joi.number().min(0).allow(null, ""),
        category: Joi.string().trim().required(),
        isPerishable: Joi.boolean().required(),
        foodType: Joi.string().valid("VEG", "NON-VEG", "EGG").required(),
        imageUrl: Joi.string().uri().allow("", null),
        isAvailable: Joi.boolean()
    }).required()
});

module.exports = menuItemSchema;