const express = require('express');
const router = express.Router();


const asyncWrap = require("../utils/asyncWrap.js");
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware.js');
const userController  = require('../controller/user.js');

// signup
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(asyncWrap (userController.signup));


// login
// passport.authenticate() middleware invokes req.login() automatically.
// This function is primarily used when users sign up, during which req.login() can be invoked to automatically log in the newly registered user.
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,  passport.authenticate("local", {failureRedirect: "/tastebite/login", failureFlash: true}), userController.login);


// logout
router.post("/logout", userController.logout);

module.exports = router;