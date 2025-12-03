const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

module.exports.addProduct = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Product not found");
        return res.redirect("/listings/allProducts");
    }

    // Prevent duplicates
    if (!Array.isArray(req.user.cart)) req.user.cart = []; //cart exist!
    if (!req.user.cart.includes(id)) {
        req.user.cart.push(id);
        await req.user.save();
    }

    req.flash("success", "Product added to cart");
    res.redirect("/cart");
};

module.exports.viewCart = async (req, res) => {
    await req.user.populate("cart");
    res.render("listings/cart.ejs", { cartItems: req.user.cart });
};

module.exports.removeCart = async (req, res) => {
    const { id } = req.params;
    req.user.cart = req.user.cart.filter(item => item._id.toString() !== id);
    await req.user.save();
    req.flash("success", "Product removed from cart");
    res.redirect("/cart");
};