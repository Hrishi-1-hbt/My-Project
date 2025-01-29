const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password); // Handles password hashing
    console.log("New user registered:", registeredUser);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to Wanderlust!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out.");
    res.redirect("/listings");
  });
};
module.exports.renderProfile = async (req, res) => {
  try {
      const user = await User.findById(req.user._id)
          .populate({
              path: 'listings',
              select: 'title price image location'
          })
          .populate({
              path: 'bookings',
              populate: {
                  path: 'listing',
                  select: 'title image'
              }
          });

      res.render("users/profile", { user });
  } catch (error) {
      req.flash("error", "Error loading profile");
      res.redirect("/listings");
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
      const { firstName, lastName, email, phoneNumber, bio } = req.body;
      const updateData = {
          firstName,
          lastName,
          email,
          phoneNumber,
          bio
      };

      // Handle profile photo upload
      if (req.file) {
          updateData.profilePhoto = req.file.path.replace("public", "");
      }

      const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          updateData,
          { new: true, runValidators: true }
      );

      req.flash("success", "Profile updated successfully");
      res.redirect("/profile");
  } catch (error) {
      req.flash("error", error.message);
      res.redirect("/profile");
  }
};


// Google Authentication Handlers
module.exports.googleCallback = async (req, res) => {
  req.flash("success", "Welcome back via Google!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.googleFailure = (req, res) => {
  req.flash("error", "Google login failed. Please try again.");
  res.redirect("/login");
};
