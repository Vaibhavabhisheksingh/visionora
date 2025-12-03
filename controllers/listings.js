const Listing = require("../models/listing.js");
const Specialist = require("../models/specialist");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}).limit(4);
    const allSpecialists = await Specialist.find({}).limit(4); 
    res.render("./listings/index.ejs", {allListings, allSpecialists});
};

module.exports.allProducts = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/allProducts.ejs", { allListings });
};

module.exports.male =  async (req, res) => {
    const listings = await Listing.find({ category: "male" });
    res.render("./listings/category.ejs", { category: "Male", listings });
};

module.exports.female = async (req, res) => {
    const listings = await Listing.find({ category: "female" });
    res.render("./listings/category.ejs", { category: "Female", listings });
};

module.exports.kids = async (req, res) => {
    const listings = await Listing.find({ category: "kids" });
    res.render("./listings/category.ejs", { category: "Kids", listings });
};

module.exports.lens = async (req, res) => {
    const listings = await Listing.find({ category: "lens" });
    res.render("./listings/category.ejs", { category: "Lens", listings });
};

module.exports.others = async (req, res) => {
    const listings = await Listing.find({ category: "others" });
    res.render("./listings/category.ejs", { category: "Others", listings });
};

module.exports.new = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.show = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path :"reviews", populate: {path: "author"}});
    if(!listing) {
        req.flash("error", "listing not found");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {listing});
};

module.exports.create =  async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    req.body.listing.category = req.body.listing.category.toLowerCase();
    const newListing = new Listing(req.body.listing);
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "new listing created");
    res.redirect("/listings");
}; 
 
module.exports.edit = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing})
};

module.exports.update = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.delete = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
};