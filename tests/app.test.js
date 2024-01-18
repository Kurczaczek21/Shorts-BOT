const request = require("supertest");
const app = require("../app.js");

describe("POST /api/auth/signup", () => {
  describe("Given a username and password", () => {
    test("Create user with a 201 status code", async () => {
      const response = await request(app).post("/api/auth/signup").send({
        username: "admin",
        password: "IO2023",
      });
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ message: "User created." });
    });

    test("Specify content-type JSON in header", async () => {
      const response = await request(app).post("/api/auth/signup").send({
        username: "testowy",
        password: "haselko",
      });
      expect(response.headers["content-type"]).toEqual(
        "application/json; charset=utf-8"
      );
    });

    test("Should response with a 409 status code for duplicate user", async () => {
      const response = await request(app).post("/api/auth/signup").send({
        username: "testowy",
        password: "haselko",
      });
      expect(response.statusCode).toBe(409);
      expect(response._body.message).toEqual(
        "User already exists in the database"
      );
    });
  });
});

describe("POST /api/auth/signin", () => {
  describe("Given a username and password", () => {
    test("Signin with correct credentials should return a 200 status code", async () => {
      const response = await request(app).post("/api/auth/signin").send({
        username: "admin",
        password: "IO2023",
      });
      expect(response.statusCode).toBe(200);
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.body).not.toHaveProperty("password");
    });

    test("Signin with incorrect credentials should return a 401 status code", async () => {
      const response = await request(app).post("/api/auth/signin").send({
        username: "admin",
        password: "incorrect-password",
      });
      expect(response.statusCode).toBe(401);
      expect(response._body.message).toEqual("Incorrect password");
    });

    test("Signin with non-existing username should return a 404 status code", async () => {
      const response = await request(app).post("/api/auth/signin").send({
        username: "non-existing-user",
        password: "password",
      });
      expect(response.statusCode).toBe(404);
      expect(response._body.message).toEqual("User not found");
    });
  });
});

describe("POST /api/auth/signout", () => {
  test("Signout should return a 200 status code and clear accessToken cookie", async () => {
    const response = await request(app).post("/api/auth/signout");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Logged out successfully" });
    expect(response.headers["set-cookie"][0]).toEqual("accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT")
  });
});




// describe("GET /api/auth/check-login", () => {
//   test("Check login status with valid accessToken should return a 200 status code", async () => {
//     const signinResponse = await request(app).post("/api/auth/signin").send({
//       username: "testowy",
//       password: "haselko",
//     });
//     const accessToken = signinResponse.headers["set-cookie"][0]
//       .split(";")[0]
//       .split("=")[1];

//     const checkLoginResponse = await request(app)
//       .get("/api/auth/check-login")
//       .set("Cookie", `accessToken=${accessToken}`);

//     expect(checkLoginResponse.statusCode).toBe(200);
//     expect(checkLoginResponse.body).toEqual({ message: "User is logged in" });
//   });

//   test("Check login status without accessToken should log 'user not logged in' and return undefined", async () => {
//     const checkLoginResponse = await request(app).get("/api/auth/check-login");
//     expect(checkLoginResponse.statusCode).toBeUndefined(); // No explicit status code expected
//     expect(checkLoginResponse.text).toContain("user not logged in");
//   });
// });
