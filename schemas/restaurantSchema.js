const Joi = require("joi");

const restaurantSchema =  Joi.object({
    restaurant : Joi.object({
        imageURL: Joi.string().allow("", null),
        name: Joi.string().required(),
        cuisines: Joi.array().items(Joi.string().trim().required()).min(1).required(),
        description: Joi.string().required(),
        address: Joi.object({
            streetAddress: Joi.string().required(),
            city: Joi.string().required(),
            pincode: Joi.string().required(),
            landmark: Joi.string().allow("")
        }).required(),
        phoneNumber: Joi.string().required(),
        email: Joi.string().email().required(),
        isOpen: Joi.boolean().default(true),
        isActive: Joi.boolean().default(true),
    }).required()
}).unknown(true);;

module.exports = restaurantSchema;