const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl, isLoggedIn, upload } = require("../middleware"); // Make sure upload middleware exists
const userController = require("../controllers/users");

// Existing authentication routes
router.route("/signup")
  .get(userController.renderSignupForm)
  .post(saveRedirectUrl, wrapAsync(userController.signup));

router.route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);

// Google Authentication Routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.googleCallback
);

router.get("/auth/google/failure", userController.googleFailure);

// ============= NEW PROFILE ROUTES =============
router.route("/profile")
  .get(isLoggedIn, wrapAsync(userController.renderProfile)) // GET profile page
  .put( // UPDATE profile
    isLoggedIn,
    upload.single('profilePhoto'), // Handle file upload
    wrapAsync(userController.updateProfile)
  );

module.exports = router;