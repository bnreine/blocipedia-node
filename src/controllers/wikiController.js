const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/wiki");
const Wiki = require("../db/models").Wiki;
const markdown = require("markdown").markdown;

module.exports = {
  index(req, res, next){
    const authorized = new Authorizer(req.user).show();
    if(authorized) {
      wikiQueries.getAllWikis(req.user, (err, wikis) => {
        if(err){
          req.flash("error", err);
          res.redirect("/");
        } else {
          res.render("wikis/index", {wikis, markdown});
        }
      })
    } else {
      req.flash("notice", "You must be signed in to do that.")
      res.redirect("/");
    }
  },
  new(req, res, next){
    const authorized = new Authorizer(req.user).new();
    if(authorized) {
      res.render("wikis/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/");
    }
  },
  create(req, res, next){
       const authorized = new Authorizer(req.user).create();
       if(authorized) {
         let newWiki= {
           title: req.body.title,
           body: req.body.body,
           userId: req.user.id,
           private: req.body.private || false
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
    const authorized = new Authorizer(req.user).show();
    if(authorized) {
      wikiQueries.getWiki(req.params.id, (err, wiki) => {
        if (err || wiki == null){
          res.redirect(404, "/");
        } else {
          res.render("wikis/show", {wiki, markdown});
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
    const authorized = new Authorizer(req.user, req.body).edit();
    if(authorized) {
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
    wikiQueries.getWiki(req.params.id, (err, previousWiki) => {
      let updatedWiki= {
        title: req.body.title,
        body: req.body.body,
        private: req.body.private || previousWiki.private
      };
      wikiQueries.updateWiki(req, updatedWiki, (err, wiki) => {
        if(err || wiki == null){
          res.redirect(`/wikis`);
        } else {
          res.redirect(`/wikis/${req.params.id}`);
        }
      });
    })
  }
}
