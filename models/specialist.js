const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const specialistSchema = new Schema({
    name: {
        type : String,
        required: true,
    },
    specialization: String,
    image: {
        url:{
            type: String,
        },
        filename: String,
    },
    experience: Number, // years
    fees: Number,
    description: String,
    location: {
        type: String,
        required: true,
        default: "Not specified"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "SpecialistReview",
        }
    ]
});

module.exports = mongoose.model("Specialist", specialistSchema);
