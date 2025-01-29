const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.js");
const { isLoggedIn } = require("../middleware");

router.post("/:id", isLoggedIn, bookingController.createBooking);

module.exports = router;
