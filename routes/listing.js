const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const Specialist = require("../models/specialist");
// const isAdmin = require("../middleware.js");
const {isLoggedIn, validateListing, isAdmin} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

 

//index 
router.get("/", wrapAsync(listingController.index)); 

//all products
router.get("/allProducts", wrapAsync(listingController.allProducts)); 

// MALE PRODUCTS
router.get("/male", listingController.male);

// FEMALE PRODUCTS
router.get("/female", listingController.female);

// KIDS PRODUCTS
router.get("/kids", listingController.kids);

// LENS PRODUCTS
router.get("/lens", listingController.lens);

// OTHERS PRODUCTS
router.get("/others", listingController.others);


//new
router.get("/new",isLoggedIn,isAdmin, listingController.new);
//show
router.get("/:id",wrapAsync( listingController.show));

//create route
router.post("/",isLoggedIn,isAdmin, upload.single("listing[image]"), (req, res, next) => {
    if (req.body.listing.category) {
        req.body.listing.category = req.body.listing.category.toLowerCase();
    }
    next();
    }, validateListing, wrapAsync(listingController.create));

//edit route
router.get("/:id/edit",isLoggedIn,isAdmin, listingController.edit);

//update route
 router.put("/:id", isLoggedIn,isAdmin,  upload.single("listing[image]"),(req, res, next) => {
    if (req.body.listing.category) {
        req.body.listing.category = req.body.listing.category.toLowerCase();
    }
    next();
}, validateListing, wrapAsync(listingController.update));
//delete route
router.delete("/:id",isLoggedIn, isAdmin, wrapAsync(listingController.delete));

module.exports = router;