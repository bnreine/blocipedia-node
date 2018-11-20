const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require('../../src/db/models/index').sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;



describe("routes : wikis", () => {

  beforeEach((done) => {
    this.wiki;
    this.User;


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
        body: "First wiki body",
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
    done();
  })
})

//**********************start Guest context*********************************************
describe("guest attempting to perform CRUD actions for Wiki", () => {

// #2
     beforeEach((done) => {    // before each suite in this context
       request.get({           // mock authentication
         url: "http://localhost:3000/auth/fake",
         form: {
           id: 0 // flag to indicate mock auth to destroy any session
         }
       },
         (err, res, body) => {
           done();
         }
       );
     });



    describe("GET /wikis", () => {

      it("should not allow guests to see this page and redirect to /", (done) => {
        request.get(`${base}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Welcome to Blocipedia");
          done();
        })

      })

    })


    describe("GET /wikis/new", () => {

      it("should not render a new wiki form and redirect to /", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Welcome to Blocipedia");
          done();
        });
      });

    });



    describe("POST /wikis/create", () => {

      it("should not create a new wiki and should redirect to /", (done) => {
        const options = {
          url: `${base}create`,
          form: {
            title: "Second wiki title",
            body: "Second wiki body"
          }
        };
        request.post(options,
          (err, res, body) => {
            //expect(err).toBeNull();
            Wiki.findOne({where: {title: "Second wiki title"}})
            .then((wiki) => {
              expect(wiki).toBeNull();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
            done();
          });
      });

   });



   describe("GET /wikis/:id", () => {

    it("should not render a view with the selected wiki", (done) => {
      request.get(`${base}${this.wiki.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Welcome to Blocipedia");
        done();
      });
    });

  });




  describe("POST /wikis/:id/destroy", () => {

    it("should not delete the wiki with the associated ID", (done) => {
      expect(this.wiki.id).toBe(1);
      request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
        Wiki.findById(1)
        .then((wiki) => {
          expect(err).toBeNull();
          expect(wiki).not.toBeNull();
          done();
        })
      });

    });

  });



  describe("GET /wikis/:id/edit", () => {

    it("should not render an edit page for the associated id", (done) => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).not.toContain("Edit Wiki");
        expect(body).toContain("Welcome to Blocipedia");
        done();
      })
    })

  })



  describe("POST /wikis/:id/update", () => {

    it("should not update the associated wiki", (done) => {
      const options = {
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "Updated title",
          body: "Updated body"
        }
      };
      request.post(options, (err, res, body) => {
        Wiki.findById(this.wiki.id)
        .then((wiki) => {
          expect(wiki.title).toBe("First wiki title");
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
      })

    })

  })










})

//**********************end Guest context*********************************************










//**********************start member logged in context*********************************************
describe("member attempting to perform CRUD actions for Wiki", () => {

// #2
     beforeEach((done) => {    // before each suite in this context
       request.get({           // mock authentication
         url: "http://localhost:3000/auth/fake",
         form: {
           id: 1,
           email: "member@gmail.com"
         }
       },
         (err, res, body) => {
           done();
         }
       );
     });



    describe("GET /wikis", () => {

      it("should allow members to see /wikis", (done) => {
        request.get(`${base}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          done();
        })

      })
    })




    describe("GET /wikis/new", () => {

      it("should render a new wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });

    });




    describe("POST /wikis/create", () => {

      it("should create a new wiki", (done) => {
        const options = {
          url: `${base}create`,
          form: {
            title: "Second wiki title",
            body: "Second wiki body"
          }
        };
        request.post(options,
          (err, res, body) => {
            expect(body).toContain("Redirecting to /wikis")
            Wiki.findOne({where: {title: "Second wiki title"}})
            .then((wiki) => {
              expect(wiki).not.toBeNull();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
            done();
          });
      });

   });



   describe("GET /wikis/:id", () => {

    it("should render a view with the selected wiki", (done) => {
      request.get(`${base}${this.wiki.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("First wiki title");
        done();
      });
    });

  });




  describe("POST /wikis/:id/destroy", () => {

    it("should delete the wiki with the associated ID", (done) => {
      expect(this.wiki.id).toBe(1);
      request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
        Wiki.findById(1)
        .then((wiki) => {
          expect(err).toBeNull();
          expect(wiki).toBeNull();
          done();
        })
      });

    });

  });



  describe("GET /wikis/:id/edit", () => {

    it("should render an edit page for the associated id", (done) => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Wiki");
        expect(body).not.toContain("Welcome to Blocipedia");
        done();
      })
    })

  })




  describe("POST /wikis/:id/update", () => {

    it("should update the wiki with the given values", (done) => {
      const options = {
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "Snowman Building Competition",
          body: "I love watching them melt slowly."
        }
      };

      request.post(options,
        (err, res, body) => {

        expect(err).toBeNull();

        Wiki.findOne({
          where: {id: this.wiki.id}
        })
        .then((wiki) => {
          expect(wiki.title).toBe("Snowman Building Competition");
          done();
        });
      });

    });

  });






})
//**********************end member logged in context*********************************************





})
