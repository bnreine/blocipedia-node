const wikiQueries = require("../db/queries.wikis.js");
//const Authorizer = require("../policies/wiki");

module.exports = {
  index(req, res, next){
    if(req.user){
      wikiQueries.getAllWikis((err, wikis) => {
        if(err){
          req.flash("error", err);
          res.redirect(500, "/");
        } else {
          res.render("wikis/index", {wikis});
        }
      })
    } else {
      req.flash("notice", "You must be signed in to do that.")
      res.redirect("/");
    }
  },
  new(req, res, next){
    //const authorized = new Authorizer(req.user).new();
    //if(authorized) {
    if (req.user){
      res.render("wikis/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/");
    }
  },
  create(req, res, next){
       //const authorized = new Authorizer(req.user).create();
       //if(authorized) {
       if(req.user){
         let newWiki= {
           title: req.body.title,
           body: req.body.body,
           userId: req.user.id
         };
         wikiQueries.addWiki(newWiki, (err, wiki) => {
           if(err){
             res.redirect(500, "/wikis/new");
           } else {
             res.redirect(303, `/wikis/${wiki.id}`);
           }
         });
       } else {
         req.flash("notice", "You are not authorized to do that.");
         res.redirect("/");
       }
  },
  show(req, res, next){
    if(req.user){
      wikiQueries.getWiki(req.params.id, (err, wiki) => {
        if (err || wiki == null){
          res.redirect(404, "/");
        } else {
          res.render("wikis/show", {wiki});
        }
      })
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/");
    }
  },

  destroy(req, res, next){
    wikiQueries.deleteWiki(req, (err, deletedRecordsCount) => {
      if(err){
        res.redirect(500, `/wikis/${req.params.id}`)
      } else {
        res.redirect(303, "/wikis")
      }
    });
  },
  edit(req, res, next){
    if(req.user){
      wikiQueries.getWiki(req.params.id, (err, wiki) => {
        if (err){
          res.redirect(`wikis/${req.params.id}`);
        } else {
          res.render("wikis/edit", {wiki});
        }
      })
    } else {
      res.redirect("/");
    }
  },
  update(req, res, next){
    console.log("update controller")
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if(err || wiki == null){
        res.redirect(404, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  }


}
