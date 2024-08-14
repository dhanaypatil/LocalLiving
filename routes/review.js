const express = require("express");
const router = express.Router({mergeParams: true}); //to use params from parent route which is in the app.js
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

//used it in validateReview which was later made a middleware in the middleware.js file thus shifteed it there 
// const {reviewSchema} = require("../schema.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedin, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//POST review Route
router.post("/", isLoggedin, validateReview, wrapAsync(reviewController.createReview));

//delete Review route
router.delete("/:reviewId", isLoggedin, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;