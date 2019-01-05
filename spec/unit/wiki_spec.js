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





  describe("#create()", () => {

    it("should create a wiki object with a title, body, private and userId", (done) => {
      Wiki.create({
        title: "Second wiki title",
        body: "Second wiki body",
        private: false,
        userId: this.user.id
      })
      .then((wiki) => {
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




})
