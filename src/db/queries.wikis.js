const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/wiki");
const User = require("./models").User;


module.exports = {
  getAllWikis(user, callback){

    Wiki.scope({method: ["getPublicWikis"]}).all()
    .then((publicWikis) => {
      let wikis = {};
      wikis["publicWikis"] = publicWikis;
      const adminAuthorized = new Authorizer(user)._isAdmin();
      if (adminAuthorized){
        //console.log(adminAuthorized)
        Wiki.scope({method: ["getAllPrivateWikis"]}).all()
        .then((allPrivateWikis) => {
          wikis["privateWikis"] = allPrivateWikis;
          callback(null, wikis);
        })
        .catch((err) => {
          callback(err);
        })
      } else {
        User.scope({method: ["getAllOwnedPrivateWikis", user.id]}).all()
        .then((users) => {
          wikis["privateWikis"] = users[0] ? users[0].wikis : null;
          callback(null, wikis);
        })
        .catch((err) => {
          callback(err);
        })
      }
    })
    .catch((err) => {
      callback(err);
    })
  },
  addWiki(newWiki, callback){
    return Wiki.create(newWiki)
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },
  getWiki(id, callback){
    return Wiki.findById(id)
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },
  deleteWiki(req, callback){
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      const authorized = new Authorizer(req.user, wiki).destroy();
      if(authorized) {
        wiki.destroy()
        .then((res) => {
          callback(null, wiki);
        });

      } else {
        req.flash("notice", "You are not authorized to do that.")
        callback(401);
      }
    })
    .catch((err) => {
      callback(err);
    });
  },
  updateWiki(req, updatedWiki, callback){

  return Wiki.findById(req.params.id)
  .then((wiki) => {
    if(!wiki){
      return callback("Wiki not found");
    }
    const authorized = new Authorizer(req.user, wiki).update();
    if(authorized) {
      wiki.update(updatedWiki, {
        fields: Object.keys(updatedWiki)
      })
      .then(() => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      callback("Forbidden");
    }
  });
  }

}
