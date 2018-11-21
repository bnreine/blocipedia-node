require('dotenv').config();
const sgMail = require('@sendgrid/mail');

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
    User.afterCreate((user, callback) => {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: user.email,
        from: 'bnreinecke0209@gmail.com',
        subject: 'Confirmed Account Creation',
        text: 'Your account is confirmed!'
      };
      sgMail.send(msg);
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
