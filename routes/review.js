const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isReviewOwner, validateReview } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



//------------------------ REVIEW ROUTE ---------------

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.reviewRoute));


//----------------- DELETE REVIEW ROUTE------------

router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync(reviewController.deleteReview));

module.exports = router;