const Listing = require("../models/listing.js");

// INDEX ROUTE
module.exports.index = async (req, res) => {
    const data = await Listing.find({});
    res.render("home.ejs", { data });
};

//NEW ROUTE
module.exports.renderNewForm = (req, res) => {
    res.render("new.ejs");
};

//SHOW ROUTE
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const data = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", }, }).populate("owner");

    if (!data) {
        // throw new ExpressError(404, "Listing Not Found");
        req.flash("error", "Listing is not available for the specified data");
        res.redirect("/listing");
    }
    else
        res.render("show.ejs", { data });
};

//CREATE ROUTE
module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "new listing created")
    res.redirect("/listing");
};

//EDIT ROUTE
module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const data = await Listing.findById(id);

    if (!data) {
        req.flash("error", "Listing is not available for the specified data");
        res.redirect("/listing");
    }
    else {
        let originalUrl = data.image.url;
        originalUrl = originalUrl.replace("/upload" , "/upload/w_250");
        res.render("edit.ejs", { data , originalUrl });
    }

};

//UPDATE ROUTE
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true });
    if (typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listing/${id}`);
};

//DELETE ROUTE
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Deleted successfully !!");
    res.redirect("/listing");
};