const User = require("../models/user");
const passport = require("passport");
const Order = require("../models/order");
const Appointment = require("../models/appointment");
const Review = require("../models/review");
const SpecialistReview = require("../models/specialistReview");


module.exports.signUp = (req, res) => {
    res.render("users/signup");
};

module.exports.createProfile = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        // 1. Create a new user instance (password is handled by 'register' later)
        const newUser = new User({ email, username });

        // 2. Use the static method provided by passport-local-mongoose
        // This method saves the user AND hashes the password.
        const registeredUser = await User.register(newUser, password);

        // 3. Log the newly registered user in immediately
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err); // Handle login error
            }
            req.flash("success", "User Registered Successfully");
            res.redirect("/listings");
        });

    } catch (e) {
        // Handle errors like duplicate usernames, invalid emails, etc.
        req.flash("error", e.message); // Display the specific error message to the user
        res.redirect("/signup"); // Redirect them back to the signup page
    }
};

module.exports.loginPage = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.profile =  async (req, res) => {
    const user = await User.findById(req.user._id);
    const orders = await Order.find({ user: req.user._id }).populate("product");
    const appointments = await Appointment.find({ user: req.user._id }).populate("specialist");

    res.render("profile", { user, orders, appointments });
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged Out Successfully");
        res.redirect("/listings");
    })
};

// module.exports.deleteAccount = async (req, res) => {
//     const userId = req.user._id;

//     // Delete all orders by user
//     await Order.deleteMany({ user: userId });

//     // Delete all appointments by user
//     await Appointment.deleteMany({ user: userId });

//     // Delete all reviews by user
//     await Review.deleteMany({ author : userId });

//     // Delete all specialist reviews by user
//     await SpecialistReview.deleteMany({ author : userId });

//     // Finally delete user
//     await User.findByIdAndDelete(userId);

//     req.logout(function(err) {
//         if(err) return next(err);
//         req.flash("success", "Your account and all related data have been deleted.");
//         res.redirect("/listings");
//     });
// };

module.exports.deleteAccount = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Delete related docs
        await Order.deleteMany({ user: userId });
        await Appointment.deleteMany({ user: userId });
        await Review.deleteMany({ author: userId });
        await SpecialistReview.deleteMany({ author: userId });

        // Finally delete user
        await User.findByIdAndDelete(userId);

        // Logout and redirect (use next if provided)
        req.logout(function(err) {
            if (err) {
                // If next provided, forward the error, otherwise log and redirect with flash
                if (typeof next === "function") return next(err);
                console.error("Logout error:", err);
                req.flash("error", "Logged out with error");
                return res.redirect("/listings");
            }
            req.flash("success", "Your account and all related data have been deleted.");
            res.redirect("/listings");
        });
    } catch (err) {
        console.error("Error deleting account:", err);
        if (typeof next === "function") return next(err);
        req.flash("error", "Something went wrong!");
        res.redirect("/profile");
    }
};
