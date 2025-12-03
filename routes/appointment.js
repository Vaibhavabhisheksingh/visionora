const express = require("express");
const router = express.Router();
const Specialist = require("../models/specialist");
const Appointment = require("../models/appointment");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isAppointmentOwner } = require("../middleware");

const appointmentController = require("../controllers/appointment");

// Show appointment form
router.get("/:id/new", isLoggedIn, wrapAsync(appointmentController.showAppointmentForm));

// Create appointment
router.post("/:id", isLoggedIn, wrapAsync(appointmentController.createAppointment));


// View user appointments
router.get("/", isLoggedIn, wrapAsync(appointmentController.viewAppointments));


router.delete("/:id",
    isLoggedIn,
    isAppointmentOwner,
    wrapAsync(appointmentController.deleteAppointment)
);


module.exports = router;
