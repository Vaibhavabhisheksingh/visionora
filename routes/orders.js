const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Listing = require("../models/listing");
const User = require("../models/user");

const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

const orderController = require("../controllers/orders");

// ===============================
// SHOW SHIPPING ADDRESS FORM
// ===============================
router.get("/:productId/address", isLoggedIn, wrapAsync(orderController.showAddressForm));

router.post("/:productId/buy", isLoggedIn, wrapAsync( orderController.buyProduct));

// ===============================
// SHOW ALL ORDERS
// ===============================
router.get("/", isLoggedIn, wrapAsync( orderController.showAllOrders));

// ===============================
// CANCEL ORDER
// ===============================
router.delete("/:orderId", isLoggedIn, wrapAsync(orderController.cancelOrder));

module.exports = router;
