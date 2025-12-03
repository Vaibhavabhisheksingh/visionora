const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Listing = require("../models/listing");
const Specialist = require("../models/specialist");
const Order = require("../models/order");
const Appointment = require("../models/appointment");
const Review = require("../models/review"); // <-- ADD THIS
const SpecialistReview = require("../models/specialistReview"); 
const adminController = require("../controllers/admin");
// Middleware
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

// Check Admin Only
function isAdmin(req, res, next) {
    if (req.user && req.user.username === "admin") {
        return next();
    }
    req.flash("error", "Access denied.");
    return res.redirect("/");
}

// ================================
//       ADMIN DASHBOARD
// ================================
router.get("/", isLoggedIn, isAdmin, wrapAsync(adminController.adminDashboard));

// ================================
//         USERS SECTION
// ================================

// Show all users
router.get("/users", isLoggedIn, isAdmin, wrapAsync(adminController.showUsers));

// Single user details (Appointments + Orders)
// SHOW user details
router.get("/users/:id", isLoggedIn, isAdmin, adminController.userDetails);


// DELETE user and all related data
router.delete("/users/:id", isLoggedIn, isAdmin, adminController.deleteUser);


// ================================
//        PRODUCTS SECTION
// ================================

// All Products 
router.get("/products", isLoggedIn, isAdmin, wrapAsync(adminController.allProducts));

// Edit Product Form
router.get("/products/:id/edit", isLoggedIn, isAdmin, wrapAsync(adminController.editProductForm));

// Update Product
router.put("/products/:id", isLoggedIn, isAdmin, wrapAsync(adminController.updateProduct));

// Delete Product
router.delete("/products/:id", isLoggedIn, isAdmin, wrapAsync(adminController.deleteProduct));

// ================================
//      SPECIALISTS SECTION
// ================================

// All specialists
router.get("/specialists", isLoggedIn, isAdmin, wrapAsync(adminController.allSpecialists));

// Edit specialist
router.get("/specialists/:id/edit", isLoggedIn, isAdmin, wrapAsync(adminController.editSpecialist));

// Update specialist
router.put("/specialists/:id", isLoggedIn, isAdmin, wrapAsync(adminController.updateSpecialist));

// Delete specialist
router.delete("/specialists/:id", isLoggedIn, isAdmin, wrapAsync(adminController.deleteSpecialist));

module.exports = router;
