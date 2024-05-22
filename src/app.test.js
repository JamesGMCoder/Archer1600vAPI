const request = require("supertest");

const app = require("./app");

describe("Test example", () => {
    // Hidden for simplicity
    test("GET /jim", (done) => {
      request(app)
        .get("/jim")
        .expect("Content-Type", /json/)
        .expect(400)
        .expect((res) => {
            res.body.data.length = 2;
            res.body.data[0].email = "test@example.com";
            res.body.data[1].email = "francisco@example.com";
          })        
        .end((err, res) => {
            return done();
          })        
        // Even more logic goes here
    });
    // More things come here
  });