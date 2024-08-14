const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

// router.get("/signup", userController.renderSignupForm);
// router.post("/signup", wrapAsync(userController.signup));

// : the code can be simplified to router.route("/signup") since both the requests share same path, we are keeping the routes in listing separate for now cz they show a flow of how I built the code, which might be useful in the future cz this will be my reference project for further project, we will sure add this route shorthand for paths in the future projects because that will be a good practice after finishing a project!

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(savedRedirectUrl, passport.authenticate("local", {failureRedirect: '/login' , failureFlash: true}), wrapAsync(userController.login));

// router.get("/login", userController.renderLoginForm);
// router.post("/login", savedRedirectUrl, passport.authenticate("local", {failureRedirect: '/login' , failureFlash: true}), wrapAsync(userController.login));

router.get("/logout", userController.logout);

module.exports = router;