const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  timeSlot: { type: String, required: true },
});

// Create unique index to prevent double bookings
bookingSchema.index({ timeSlot: 1 }, { unique: true });

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
