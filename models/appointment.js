const { required } = require("joi");
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    specialist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Specialist",
        required: true
    },
    bookedAt: {
        type: Date,
        default: Date.now
    },
    appointmentTime: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
