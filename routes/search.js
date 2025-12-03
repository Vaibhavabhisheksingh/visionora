const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Specialist = require("../models/specialist");

const searchController = require("../controllers/search");

// SEARCH ROUTE
router.get("/", wrapAsync(searchController.search));

module.exports = router;
