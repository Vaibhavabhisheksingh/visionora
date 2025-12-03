const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware");
const {isLoggedIn} = require("../middleware");
const Order = require("../models/order");
const Appointment = require("../models/appointment");
const Review = require("../models/review");
const SpecialistReview = require("../models/specialistReview");
const userController = require("../controllers/users");


router.get("/signup", userController.signUp);


router.post("/signup", userController.createProfile);


router.get("/login", userController.loginPage);

router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
  userController.login
);

router.get("/profile", isLoggedIn, userController.profile);


router.get("/logout", userController.logout);

// DELETE ACCOUNT
router.post("/delete-account", isLoggedIn, wrapAsync(userController.deleteAccount));



module.exports = router;