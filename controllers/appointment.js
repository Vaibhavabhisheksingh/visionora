const Specialist = require("../models/specialist");
const Appointment = require("../models/appointment");
const User = require("../models/user");

module.exports.showAppointmentForm = async (req, res) => {
    const specialist = await Specialist.findById(req.params.id);
    if (!specialist) {
        req.flash("error", "Specialist not found");
        return res.redirect("/specialists");
    }
    res.render("appointments/new", { specialist });
};

module.exports.createAppointment = async (req, res) => {
    
    const specialist = await Specialist.findById(req.params.id);
    if (!specialist) {
        req.flash("error", "Specialist not found");
        return res.redirect("/specialists");
    }

    const { appointmentTime } = req.body;

    // Create appointment with correct doctor details
    const appointment = new Appointment({
        specialist: specialist._id,          // auto doctor id
        user: req.user._id,                 // auto user id
        appointmentTime,                    // user selected
        fees: specialist.fees,              // auto from specialist schema
        location: specialist.location,      // auto from specialist schema
        createdAt: new Date()
    });

    await appointment.save();

    if (!Array.isArray(req.user.appointments)) {
        req.user.appointments = [];
    }
    // Store in user's appointments list
    req.user.appointments.push(appointment._id);
    await req.user.save();

    req.flash("success", "Appointment booked successfully!");
    res.redirect("/appointments");
};

module.exports.viewAppointments = async (req, res) => {
    const appointments = await Appointment
        .find({ user: req.user._id })
        .populate("specialist");

    res.render("appointments/index", { appointments });
};

module.exports.deleteAppointment = async (req, res) => {

        const { id } = req.params;

        // Remove appointment from User.appointments array
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { appointments: id }
        });

        // Delete appointment
        await Appointment.findByIdAndDelete(id);

        req.flash("success", "Appointment cancelled successfully!");
        res.redirect("/appointments");
    };