const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;
const bcrypt = require("bcryptjs");



describe("routes: users", () => {


  beforeEach((done) => {

    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

  });








  describe("GET /users/sign_up", () => {

    it("should render a view with a sign up form", (done) => {
      //console.log("get sign up form")
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Welcome to Blocipedia");
        done();
      });
    });

  });










  describe("POST /users", () => {

// #1
    it("should create a new user with valid values and redirect", (done) => {

      const options = {
        url: base,
        form: {
          username: "user1",
          email: "user1@example.com",
          password: "123456789",
          passwordConfirmation: "123456789"
        }
      }

      request.post(options,
        (err, res, body) => {

// #2
          User.findOne({where: {email: "user1@example.com"}})
          .then((user) => {
            expect(user).not.toBeNull();
            expect(user.email).toBe("user1@example.com");
            expect(user.id).toBe(1);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });




// #3
    it("should not create a new user with invalid attributes and redirect", (done) => {
      request.post(
        {
          url: base,
          form: {
            username: "user1",
            email: "no",
            password: "123456789",
            passwordConfirmation: "123456789"
          }
        },
        (err, res, body) => {
          User.findOne({where: {email: "no"}})
          .then((user) => {
            expect(user).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });

  });



  describe("GET /users/sign_in", () => {

    it("should render a view with a sign in form", (done) => {
      request.get(`${base}sign_in`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign in");
        done();
      });
    });

  });




  describe("POST /users/sign_in", () => {


    beforeEach((done) => {
      const salt = bcrypt.genSaltSync();
      const userPassword = "123456";
      const hashedPassword = bcrypt.hashSync(userPassword, salt);
      User.create({
        username: "member",
        email: "member@gmail.com",
        password: hashedPassword
      })
      .then((user) => {
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      })
    })





    it("should successfully sign in and redirect to / ", (done) => {
      const options = {
        url: `${base}sign_in`,
        form: {
          email: "member@gmail.com",
          password: "123456"
        }
      }
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Redirecting to /");
        done();
      });
    });



it("should not sign in a user not in the database", (done) => {
  const options = {
    url: `${base}sign_in`,
    form: {
      email: "member1@gmail.com",
      password: "123456"
    }
  }
  request.post(options, (err, res, body) => {
    expect(err).toBeNull();
    expect(body).toContain("Unauthorized");
    done();
  });
});

  });


  describe("GET /users/payment", () => {
    it("should render a payment page to upgrade to premium membership and send ", (done) => {
      request.get(`${base}payment`, (err, res, body) => {
        expect(body).toContain("Please provide payment details to upgrade to premium");
        done();
      })
    })

  })



/*
  describe("POST /users/payment", () => {
    it("server should receive payment token, send payment to stripe api and then upgrade member to premium status", (done) => {



      request.post(`${base}payment`, (err, res, body) => {


      })


    })

  })
*/



/*
  describe("POST /users/downgrade", () => {
    it("should downgrade role from premium(1) to standard(0) and direct back to /", (done) => {
      request.post(`${base}downgrade`, (err, res, body) => {
        expect(body).toContain("Welcome to Blocipedia");
        done();
      })
    })
  })
*/



})
