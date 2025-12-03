const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Specialist = require("../models/specialist");
const SpecialistReview = require("../models/specialistReview");
const { validateReview, isLoggedIn, isSpecialistReviewAuthor } = require("../middleware.js");
const specialistReviewController = require("../controllers/specialistReviews");
// CREATE review
router.post("/", isLoggedIn, validateReview, wrapAsync(specialistReviewController.createReview)); 

// DELETE review
router.delete("/:reviewId", isLoggedIn, isSpecialistReviewAuthor, wrapAsync(specialistReviewController.deleteReview));

module.exports = router; 
