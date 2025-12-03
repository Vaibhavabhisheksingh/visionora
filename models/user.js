const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  orders: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }
  ],
  appointments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment"
        }
  ],
  reviews: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }
  ],
  specialistReviews: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SpecialistReview"
    }
  ],
  cart: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ]



});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
