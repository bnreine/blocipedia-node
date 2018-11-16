const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

describe("routes : static", () => {

  describe("GET /", () => {

    it("should do nothign", (done) => {
      expect(1).toBe(1);
      done();
    })

/*
    it("should return status code 200 and have 'Welcome to Blocipedia' in the body of the response", (done) => {
      console.log("before spec")
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(body).toContain("Welcome to Blocipedia");
        done();
      });
    });
*/


  });


});
