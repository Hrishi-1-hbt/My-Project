const Booking = require("../models/booking");

module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { userId, startDate, endDate } = req.body;

  const newBooking = new Booking({
    listing: id,
    user: userId,
    startDate,
    endDate,
  });

  await newBooking.save();
  req.flash("success", "Booking created successfully!");
  res.redirect(`/listings/${id}`);
};
