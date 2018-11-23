const userQueries = require("../db/queries.users.js");
const passport = require("passport");
require("dotenv").config();

module.exports = {
  signUp(req, res, next){
    //console.log("before render sign up")
    res.render("users/sign_up");
  },
  create(req, res, next){
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
    userQueries.createUser(newUser, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        })
      }
    });
  },
  signInForm(req, res, next){
    res.render("users/sign_in");
  },

  signIn(req, res, next){
    //console.log("begin controller")
    passport.authenticate("local")(req, res, function () {
      if(!req.user){
        console.log("error notice controller") //Doesn't spit anything out here with wrong password
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },


  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
  paymentForm(req, res, next){
    res.render("users/payment", {publishableKey: process.env.PUB_KEY})
  },
  processPayment(req, res, next){
    //console.log(req)
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    var stripe = require("stripe")(process.env.SECRET_KEY);

    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    const token = req.body.stripeToken; // Using Express

    stripe.charges.create({
      amount: 1500,
      currency: 'usd',
      description: 'Example charge',
      source: token,
    }, (err, charge) => {
      let updatedUser = {
        username: req.user.username,
        email: req.user.email,
        password: req.user.password,
        role: 1
      };
      userQueries.updateUser(req, updatedUser, (err, user) => {
        if(err){
          req.flash("error", err);
          res.redirect("/users/payment");
        } else {
          req.flash("notice", "You've successfully upgraded to premium!");
          res.redirect("/");
        }
      })
    })
  },
  downgrade(req, res, next){
    const updatedUser = {
      username: req.user.username,
      email: req.user.email,
      password: req.user.password,
      role: 0
    };
    userQueries.updateUser(req, updatedUser, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/");
      } else {
        req.flash("notice", "You've successfully downgraded your account back to standard!");
        res.redirect("/");
      }
    })


  },
  downgradeConfirmForm(req, res, next){
    console.log("before render in controller")
    res.render("users/downgrade_confirm");
    //res.render("users/sign_up");
    console.log("after render in controller")
  }


}
