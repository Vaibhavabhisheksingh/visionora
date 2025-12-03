const User = require("../models/user");
const Listing = require("../models/listing");
const Specialist = require("../models/specialist");
const Order = require("../models/order");
const Appointment = require("../models/appointment");
const Review = require("../models/review"); // <-- ADD THIS
const SpecialistReview = require("../models/specialistReview"); 


module.exports.adminDashboard = async (req, res) => {

    const totalUsers = await User.countDocuments({});
    const totalProducts = await Listing.countDocuments({});
    const totalSpecialists = await Specialist.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    res.render("admin/dashboard", {
        totalUsers,
        totalProducts,
        totalSpecialists,
        totalOrders
    });
};

module.exports.showUsers = async (req, res) => {
    const users = await User.find({});
    res.render("admin/users", { users });
};

module.exports.userDetails = async (req, res) => {
    

    try {
        const { id } = req.params;
        // Find the user
        const user = await User.findById(id);
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/admin/users");
        }

        // Fetch related Orders
        const userOrders = await Order.find({ user: id }).populate("product").lean();

        // Fetch related Appointments
        const userAppointments = await Appointment.find({ user: id }).populate("specialist").lean();


        res.render("admin/userDetails.ejs", { 
            user, 
            userOrders, 
            userAppointments, 
        });

    } catch (e) {
        console.log(e);
        req.flash("error", "Something went wrong!");
        return res.redirect("/admin/users");
    }
};

module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/admin/users");
        }

        // Delete Orders
        await Order.deleteMany({ user: id });

        // Delete Appointments
        await Appointment.deleteMany({ user: id });

        // Delete Reviews
        await Review.deleteMany({ author: id });

        // Delete Specialist Reviews
        await SpecialistReview.deleteMany({ author: id });

        // Delete user
        await User.findByIdAndDelete(id);

        req.flash("success", "User and all related data deleted successfully!");
        res.redirect("/admin/users");

    } catch (e) {
        req.flash("error", "Something went wrong!");
        res.redirect("/admin/users");
    }
};

module.exports.allProducts = async (req, res) => {
    const products = await Listing.find({});
    res.render("admin/products", { products });
};

module.exports.editProductForm = async (req, res) => {
    const product = await Listing.findById(req.params.id);
    if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/admin/products");
    }
    res.render("admin/editProduct", { product });
};

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Product updated successfully");
    res.redirect("/admin/products");
};

module.exports.deleteProduct = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Product deleted successfully");
    res.redirect("/admin/products");
};

module.exports.allSpecialists = async (req, res) => {
    const specialists = await Specialist.find({});
    res.render("admin/specialists", { specialists });
};

module.exports.editSpecialist = async (req, res) => {
    const specialist = await Specialist.findById(req.params.id);
    if (!specialist) {
        req.flash("error", "Specialist not found");
        return res.redirect("/admin/specialists");
    }
    res.render("admin/editSpecialist", { specialist });
};
module.exports.updateSpecialist = async (req, res) => {
    await Specialist.findByIdAndUpdate(req.params.id, req.body.specialist);
    req.flash("success", "Specialist updated successfully");
    res.redirect("/admin/specialists");
};

module.exports.deleteSpecialist = async (req, res) => {
    await Specialist.findByIdAndDelete(req.params.id);
    req.flash("success", "Specialist deleted successfully");
    res.redirect("/admin/specialists");
};