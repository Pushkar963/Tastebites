const Menu = require("../models/menuItem.js");
const Restaurant = require("../models/restaurant.js");


module.exports.renderNewFoodForm = async (req, res) => {
    let { restaurantId } = req.params;

    let restaurant = await Restaurant.findById(restaurantId);
    res.render("newFood", { restaurant });
}

module.exports.newFood = async (req, res) => {
    let { restaurantId } = req.params;
    req.body.menuItem.restaurantId = restaurantId;
    const newFood = new Menu(req.body.menuItem);

    if (req.file) {
        newFood.imageUrl = req.file.path;  // Cloudinary gives back a URL string here
    }

    await newFood.save();
    req.flash("success", "New Food Added");
    res.redirect(`/tastebite/restaurants/${restaurantId}`);
    
}

module.exports.renderEditFoodForm = async (req, res) => {
    let { restaurantId, foodId } = req.params;
    const food = await Menu.findById(foodId);
    res.render("editFood", { food, foodId, restaurantId });
}

module.exports.editFood = async (req, res) => {
    let { restaurantId, foodId } = req.params;
    await Menu.findByIdAndUpdate(foodId, { ...req.body.menuItem }); 
    res.redirect(`/tastebite/restaurants/${restaurantId}`);
}

module.exports.deleteFood = async (req, res) => {
    let { restaurantId, foodId} = req.params;
    let deletedFood = await Menu.findByIdAndDelete(foodId);
    console.log(deletedFood);
    req.flash("success", "Item Deleted Successfully");
    res.redirect(`/tastebite/restaurants/${restaurantId}`);
}