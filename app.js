const express = require("express");
const app = express();

if (process.env.NODE_ENV != "production")
    require('dotenv').config();


const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const dbUrl = process.env.ATLAS_DB_URL;


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600
});

store.on("error" , ()=>{
    console.log(err);
});

const session = require("express-session");
const sessionOption = {
    store,
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

const flash = require("connect-flash");




const path = require("path");

const ejsmate = require("ejs-mate");
const methodOverride = require("method-override");

const ExpressError = require("./utils/ExpressError.js");

const ListingsRouter = require("./routes/listing.js");
const ReviewsRouter = require("./routes/review.js");
const UserRouter = require("./routes/user.js");

const passport = require("passport");
const localStrategy = require("passport-local");

const User = require("./models/users.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

// ------------------ DB CONNECTION ------------------
main()
    .then(() => {
        console.log("Connection Successful");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

// ------------------ ROOT ------------------
// app.get("/", (req, res) => {
//     res.send("Hii... I am Root");
// });


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demoUser" , async(req,res) =>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username: "Student"
//     });

//     let fakeRetdUser = await User.register(fakeUser , "helloworld");
//     res.send(fakeRetdUser);
// });

//ROUTES - Shortcut 

app.use("/listing", ListingsRouter);
app.use("/listing/:id/reviews", ReviewsRouter);
app.use("/", UserRouter);


// ------------------ 404 HANDLER ------------------
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// ------------------ ERROR HANDLER ------------------
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { message });
});

// ------------------ SERVER ------------------
app.listen(3000, () => {
    console.log("Listening on port 3000");
});