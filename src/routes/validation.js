module.exports = {

  validateUsers(req, res, next) {

    if(req.method === "POST") {
      req.checkBody("email", "must be valid").isEmail();
      req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6})
      req.checkBody("passwordConfirmation", "must match password provided").optional().matches(req.body.password);
    }
    const errors = req.validationErrors();
    if (errors) {
      console.log("val errors")
      req.flash("error", errors);
      return res.redirect(req.headers.referer);
    } else {
      console.log("no val errors")
      return next();
    }
  },
  validateWikis(req, res, next) {
    //console.log(req.body.title)
    if(req.method === "POST") {
      req.checkBody("title", "must be at least 2 characters in length").isLength({min: 2})
      req.checkBody("body", "must be at least 6 characters in length").isLength({min: 6})
    }
    const errors = req.validationErrors();
    if (errors) {
      //console.log("val errors")
      req.flash("error", errors);
      return res.redirect(req.headers.referer);
    } else {
      //console.log("no val errors for" + " " + req.body.title)
      return next();
    }
  }

}
