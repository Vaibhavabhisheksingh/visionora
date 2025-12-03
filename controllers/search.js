const Listing = require("../models/listing");
const Specialist = require("../models/specialist");

module.exports.search = async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        req.flash("error", "Please enter a search term!");
        return res.redirect("/listings"); // redirect to previous page
    }

    const regex = new RegExp(q, "i"); // case-insensitive

    // Search Products
    const products = await Listing.find({
        $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } },
            { category: { $regex: regex } }
        ]
    });

    // Search Specialists
    const specialists = await Specialist.find({
        $or: [
            { name: { $regex: regex } },
            { location: { $regex: regex } },
            { specialization: { $regex: regex } }
        ]
    });

    res.render("search/results.ejs", { products, specialists, query: q });
};