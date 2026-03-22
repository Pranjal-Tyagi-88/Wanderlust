const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    .get(wrapAsync(listingController.index))   // INDEX
    .post(isLoggedIn, validateListing, upload.single("listing[image]"), wrapAsync(listingController.createListing));   // CREATE


// ------------------ NEW ROUTE ------------------
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing)) //SHOW
    .put(validateListing, isLoggedIn, isOwner,upload.single("listing[image]"), wrapAsync(listingController.updateListing)) //UPDATE
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); //DELETE



// ------------------ EDIT ROUTE ------------------
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));


module.exports = router;