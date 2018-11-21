const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {
  createUser(newUser, callback){

// #3
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

// #4
    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },
  updateUser(req, updatedUser, callback){

  return User.findById(req.user.id)
  .then((user) => {
    if(!user){
      return callback("User not found");
    }
    //const authorized = new Authorizer(req.user, wiki).update();
    //if(authorized) {
    if(req.user){
      user.update(updatedUser, {
        fields: Object.keys(updatedUser)
      })
      .then(() => {
        callback(null, user);
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
