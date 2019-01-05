require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const Wiki = require("../models").Wiki;

'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: "must be a valid email" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {});
  User.associate = function(models) {
    User.afterUpdate((user, callback) => {
      if(user.role === 0){
        User.scope({method: ["getAllOwnedPrivateWikis", user.id]}).all()
        .then((users) => {
          if (users[0] && users[0].wikis){
            users[0].wikis.forEach((privateWiki) => {
              let updatedWiki = {
                title: privateWiki.title,
                body: privateWiki.body,
                private: false,
                userId: user.id
              }
              privateWiki.update(updatedWiki, {
                fields: Object.keys(updatedWiki)
              })
              .then(() => {
              })
              .catch((err) => {
                console.log(err);
              });
            })
          }

        })
        .catch((err) => {
          console.log(err)
        })
      }
    });
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });
    User.addScope("getAllOwnedPrivateWikis", (id) => {
      return {
        include: [{
          model: models.Wiki,
          as: "wikis",
          where: {
            private: true
          }
        }],
        where: {
          id: id
        },
        order: [["createdAt", "DESC"]]
      }
    });

  };
  return User;
};
