const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");
const cartController = require("../controllers/cart");

// Add product to cart
router.post("/add/:id", isLoggedIn, cartController.addProduct);

// View cart
router.get("/", isLoggedIn, cartController.viewCart);

// Remove item from cart
router.delete("/remove/:id", isLoggedIn, cartController.removeCart);

module.exports = router;
