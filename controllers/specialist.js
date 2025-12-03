const Specialist = require("../models/specialist");

module.exports.index = async (req, res) => {
    const allSpecialists = await Specialist.find({});
    res.render("specialists/index.ejs", { allSpecialists });
};

module.exports.new = (req, res) => {
    res.render("specialists/new.ejs");
}; 
 
module.exports.create = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newSpecialist = new Specialist(req.body.specialist);
    newSpecialist.image = {url, filename};
    await newSpecialist.save();
    req.flash("success", "New specialist created");
    res.redirect("/specialists");
};

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const specialist = await Specialist.findById(id)
     .populate({
        path: "reviews",
        populate: { path: "author" } // populate the author inside each review
    });
    if (!specialist) {
        req.flash("error", "Specialist not found");
        return res.redirect("/specialists");
    }
    res.render("specialists/show.ejs", { specialist });
};

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const specialist = await Specialist.findById(id);
    if (!specialist) {
        req.flash("error", "Specialist not found");
        return res.redirect("/specialists");
    }
    res.render("specialists/edit.ejs", { specialist });
};

module.exports.update = async (req, res) => {
    const { id } = req.params;
    let specialist = await Specialist.findByIdAndUpdate(id, { ...req.body.specialist });
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    specialist.image = {url, filename};
    await specialist.save();
    }
    req.flash("success", "Specialist updated successfully");
    res.redirect(`/specialists/${id}`);
};

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Specialist.findByIdAndDelete(id);
    req.flash("success", "Specialist deleted successfully");
    res.redirect("/specialists");
};