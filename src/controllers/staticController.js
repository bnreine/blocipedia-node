module.exports = {
  index(req, res, next){
    console.log("controller")
    res.render("static/index", {title: "Welcome to Blocipedia"});
  }
}
