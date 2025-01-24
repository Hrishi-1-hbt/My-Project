const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  } catch (error) {
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
};

module.exports.createListing = async (req, res, next) => {
  const response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send();

  const url = req.file.path;
  const filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;

  const savedListing = await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.filter = async (req, res, next) => {
  const { id } = req.params;
  const allListings = await Listing.find({ category: id });
  if (allListings.length !== 0) {
    res.render("listings/index.ejs", { allListings });
  } else {
    req.flash("error", `No listing with category ${id}`);
    res.redirect("/listings");
  }
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.searchResult = async (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.redirect("/listings");
  }
  const results = await Listing.find({
    $or: [
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } },
      { title: { $regex: q, $options: "i" } },
    ],
  });

  if (results.length === 0) {
    req.flash("error", `No listing exists for '${q}'`);
    return res.redirect("/listings");
  }

  res.render("listings/search.ejs", { results, query: q });
};

// New Booking functionality
module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut } = req.body;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const totalPrice = listing.price * (new Date(checkOut) - new Date(checkIn)) / (1000 * 3600 * 24); 
  listing.bookings.push({
    user: req.user._id,
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut),
    totalPrice,
  });

  await listing.save();
  req.flash("success", "Booking created successfully!");
  res.redirect(`/listings/${id}`);
};
