'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wiki = sequelize.define('Wiki', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Wiki.associate = function(models) {
    Wiki.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Wiki.hasMany(models.Collaborator, {
      foreignKey: "wikiId",
      as: "collaborators"
    });
  };
  Wiki.addScope("getPublicWikis", () => {
    return {
      where: { private: false},
      order: [["createdAt", "DESC"]]
    }
  });
  Wiki.addScope("getAllPrivateWikis", () => {
    return {
      where: {private: true},
      order: [["createdAt", "DESC"]]
    }
  })
  return Wiki;
};
