const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema} = require("../schema.js"); //used on validateListing so moved it to middlewares

const {isLoggedin, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const{storage} = require('../cloudConfig.js');
const upload = multer({ storage }); //this is temporary folder which multer will create itself when we upload a file, but we'll later use some cloud service

//Index route
router.get("/", wrapAsync(listingController.index));

//New and create route
router.get("/new", isLoggedin, wrapAsync(listingController.renderNewForm));
router.post("/", isLoggedin, upload.single("listing[image][url]"), validateListing, wrapAsync(listingController.createListing));


//Update route
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingController.renderEditForm));
router.put("/:id", isLoggedin, isOwner, upload.single("listing[image][url]"), validateListing, wrapAsync(listingController.updateListing));

//Show route
router.get("/:id",  wrapAsync(listingController.showListing));

//delete route
router.delete("/:id", isLoggedin, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;