const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
    title: {
        type : String,
        required: true,
    },
    description: {
        type : String,
        required: true,
    },
    image: {
       url:{
            type: String,
        },
       filename: String,
    },
    price: {
        type : Number,
        required: true,
    },
    category: {
        type: String,
        enum: ["male", "female", "kids", "lens", "others"],   // IMPORTANT
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ]
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
    
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;