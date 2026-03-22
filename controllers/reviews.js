const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.reviewRoute = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // res.send("SAVED");
    req.flash("success", "Review Posted successfully..!!!")
    res.redirect(`/listing/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully....!!!")
    res.redirect(`/listing/${id}`);
};