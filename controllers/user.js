const user = require("../models/users");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new user({ email, username });
        const rgtdUser = await user.register(newUser, password);
        req.login(rgtdUser, (err) => {
            if (err)
                return next(err);
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listing");
        })
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back Wanderlust");
    const redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};


module.exports.logout = (req, res) => {
    req.logOut((err) => {
        if (err)
            return next(err);
        req.flash("success", "Logged Out successfully");
        res.redirect("/listing");
    });
};