const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;


describe("Wiki", () => {

  beforeEach((done) => {
    this.user;
    this.wiki;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        username: "member",
        email: "member@gmail.com",
        password: "123456"
      })
      .then((user) => {
        this.user = user;
        Wiki.create({
          title: "First wiki title",
          body: "Wiki body",
          private: false,
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          //console.log(wiki)
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      })
      //done();
    })
    //done();
  })





  describe("#create()", () => {

    it("should create a wiki object with a title, body, private and userId", (done) => {
      console.log("first")
      Wiki.create({
        title: "Second wiki title",
        body: "Second wiki body",
        private: false,
        userId: this.user.id
      })
      .then((wiki) => {            // confirm it was created with the values passed
        expect(wiki.body).toBe("Second wiki body");
        expect(wiki.userId).toBe(this.user.id);
        done();

      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });


    it("should not create a wiki with missing title, body, or assigned user", (done) => {
      Wiki.create({
        body: "Are the inertial dampers still engaged?"
      })
      .then((wiki) => {
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Wiki.userId cannot be null");
        done();
      })
    });


  });




/*
  describe("#setUser()", () => {

    it("should associate a wiki and a user together", (done) => {

      User.create({               // create an unassociated user
        username: "admin",
        email: "admin@gmail.com",
        password: "password"
      })
      .then((newUser) => {        // pass the user down
        expect(this.wiki.userId).toBe(this.user.id); // confirm the wiki belongs to another user
        this.wiki.setUser(newUser)                   // then reassign it
        .then((wiki) => {
          expect(wiki.userId).toBe(newUser.id);      // confirm the values persisted
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      })
    });

  });
*/


// #7: We test the `getUser` method which should return the User associated with the comment called on

/*
  describe("#getUser()", () => {

    it("should return the associated user", (done) => {
      Wiki.findById(1)
      .then((wiki) => {
        //console.log(wiki)
        wiki.getUser()
        .then((associatedUser) => {
          expect(associatedUser.id).toBe(1);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      })
    })
  })
*/




})
