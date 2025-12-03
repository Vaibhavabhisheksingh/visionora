const Specialist = require("../models/specialist");
const SpecialistReview = require("../models/specialistReview");

module.exports.createReview = async (req, res) => {
    let specialist = await Specialist.findById(req.params.id);

    let newReview = new SpecialistReview(req.body.review); // must exist
    newReview.author = req.user._id;

    specialist.reviews.push(newReview);

    await newReview.save();
    await specialist.save();

    req.flash("success", "Review added successfully!");
    res.redirect(`/specialists/${specialist._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Specialist.findByIdAndUpdate(id, { 
        $pull: {reviews: reviewId } 
    });
    await SpecialistReview.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/specialists/${id}`);
};