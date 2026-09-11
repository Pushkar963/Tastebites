const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try {
        let { username, password } = req.body
        let { email, phoneNumber, address } = req.body.user;
        const newUser = new User({username, email, phoneNumber, address});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {    // handles login after signup
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Tastebite");
            res.redirect("/tastebite");
        })   
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/tastebite/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    const referrer = req.get("Referrer");
    // Save referrer to session if it exists and isn't the login page itself
    if (referrer && !referrer.includes("/login")) {
        req.session.redirectUrl = referrer;
    }
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success","Logged in successfully");
    let redirectUrl = res.locals.redirectUrl || "/tastebite";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/tastebite");
    });
}