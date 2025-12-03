const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");
const Listing = require("./models/listing");
const Review = require("./models/review");
const Specialist = require("./models/specialist");
const Appointment = require("./models/appointment");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in first");
        return res.redirect("/login");
    }

    next();
}
module.exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.username !== "admin") {
        req.flash("error", "Unauthorized Access!");
        return res.redirect("/listings");
    }
    next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(el => el.message).join(",");
        req.flash("error", errMsg);

        return res.status(400).redirect("/listings");
    } else {
        next();
    } 
}

module.exports.validateReview = (req, res, next)=> {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    //let listing = await Listing.findById(id);
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not authorized to perform this action!");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.validateSpecialist = (req, res, next) => {
    const { name, location } = req.body.specialist;
    if (!name || !location) {
        req.flash("error", "Name and Location are required!");
        return res.redirect("back");
    }
    next();
};

module.exports.isSpecialistReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const SpecialistReview = require("./models/specialistReview");
  const review = await SpecialistReview.findById(reviewId);

  if (!review || !review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission");
    return res.redirect("back");
  }
  next();
};


module.exports.isAppointmentOwner = async (req, res, next) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
        req.flash("error", "Appointment not found!");
        return res.redirect("/appointments");
    }

    // Only the person who booked can cancel
    if (!appointment.user.equals(req.user._id)) {
        req.flash("error", "You are not allowed to cancel this appointment!");
        return res.redirect("/appointments");
    }

    next();
};

