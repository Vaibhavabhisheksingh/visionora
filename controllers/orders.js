const Order = require("../models/order");
const Listing = require("../models/listing");
const User = require("../models/user");

module.exports.showAddressForm = async (req, res) => {
    const product = await Listing.findById(req.params.productId);
    if (!product) {
        req.flash("error", "Product not found!");
        return res.redirect("/listings");
    }
    res.render("orders/addressForm", { product });
};

module.exports.buyProduct = async (req, res) => {
    const { productId } = req.params;
    const { fullName, phone, addressLine, city, state, pincode, paymentMethod } = req.body;

    const product = await Listing.findById(productId);
    if (!product) return res.status(404).send("Product not found");

    // Create order entry
    const order = new Order({
        product: product._id,
        user: req.user._id,
        shippingDetails: { fullName, phone, addressLine, city, state, pincode },
        price: product.price,
        paymentMethod,
        paymentStatus: "PENDING"
    });

    await order.save();

    const user = await User.findById(req.user._id);
    user.orders.push(order._id);
    await user.save();

    req.flash("success", "Order Confirmed!");
    res.redirect("/orders");

   
};

module.exports.showAllOrders = async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate({
            path: "orders",
            populate: { path: "product" }
        });

    res.render("orders/index", { orders: user.orders });
};

module.exports.cancelOrder = async (req, res) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
        req.flash("error", "Order not found");
        return res.redirect("/orders");
    }

    if (!order.user.equals(req.user._id)) {
        req.flash("error", "Unauthorized action!");
        return res.redirect("/orders");
    }

    await Order.findByIdAndDelete(req.params.orderId);
    req.flash("success", "Order cancelled!");
    res.redirect("/orders");
}