if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}


const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const indexRouter = require("./routes/index.js");
const restaurantRouter = require("./routes/restaurant.js");
const menuItemsRouter = require("./routes/menuItem.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const cartRouter = require("./routes/cart.js");

const User = require("./models/user.js");
const { getRelativeTime } = require("./utils/dateFormatter.js");
const ExpressError = require("./utils/ExpressError.js");


const app = express();
const port = 8080

const dbURL = process.env.ATLASDB_URL;

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});


store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

// using express sessions
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,      // used to prevent Cross Scripting Attacks
    }
};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

async function main() {
    await mongoose.connect(dbURL);
}

main()
    .then(() => console.log("Connection Successful"))
    .catch((err) => console.log(err) );


// Making getRelativeTime function available to all the ejs templates
app.locals.getRelativeTime = getRelativeTime;




app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/tastebite",  userRouter);
app.use("/tastebite", cartRouter);
app.use("/tastebite/restaurants/:restaurantId/foods", menuItemsRouter);
app.use("/tastebite/restaurants/:restaurantId/reviews", reviewsRouter);
app.use("/tastebite/restaurants", restaurantRouter);
app.use("/", indexRouter);


// Route mismatch error handling
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Central error handling for all types of errors
app.use((err, req, res, next) => {
    let { statusCode=500, message="Something Unexpected happened" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error", { statusCode, message });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});