const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Specialist = require("../models/specialist");
const { isLoggedIn, validateSpecialist, isAdmin } = require("../middleware.js"); // add isAdmin if you have one

const specialistController = require("../controllers/specialist");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// INDEX - show all specialists
router.get("/", wrapAsync(specialistController.index)); 

// NEW - show form to create new specialist
router.get("/new",isLoggedIn, isAdmin, specialistController.new);

// CREATE - add new specialist
router.post("/",isLoggedIn, isAdmin,upload.single("specialist[image]"), validateSpecialist, wrapAsync(specialistController.create));
 
// SHOW - show details of a specialist
router.get("/:id", wrapAsync(specialistController.show));

// EDIT - show form to edit specialist
router.get("/:id/edit", isLoggedIn,isAdmin, wrapAsync(specialistController.edit));

// UPDATE - update specialist info
router.put("/:id", isLoggedIn,isAdmin,upload.single("specialist[image]"), validateSpecialist, wrapAsync( specialistController.update));

// DELETE - delete a specialist
router.delete("/:id", isLoggedIn,isAdmin, wrapAsync(specialistController.delete));

module.exports = router;
 