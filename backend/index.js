const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");

dotenv.config({ path: "./config.env" }); // This line loads the environment variables from the.env file where our configuration
// file is located. This dotenv.config() function will read (or) load the environment variables from the config.env file and save
// them in the node.js environment variables.

const cors = require("cors");
const Booking = require("./models/bookingModel");

const app = express();

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // The above mongoose.connect() function will return a promise , So to resolve the promise , We are using the
    // then() function and this then function will have an access to the con variable where it can access the connections object on it.
    // console.log(con.connections);
    console.log("DB Connection is successfully established");
  })
  .catch(() => {
    console.log("Error");
  });

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World from backend" });
});

// Create booking
app.post("/api/bookings", async (req, res) => {
  try {
    const { date, time, guests, name, email, phone } = req.body;
    const timeSlot = new Date(date).toISOString().split("T")[0] + "-" + time;

    const booking = new Booking({
      date,
      time,
      guests,
      name,
      email,
      phone,
      timeSlot,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: "This time slot is already booked" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Get all bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete booking
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
