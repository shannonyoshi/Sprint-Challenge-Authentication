const request = require("supertest");
const db = require("../database/dbConfig");
const server = require("../api/server");
const Users = require("./user-model");

describe("routes.js", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });
  describe("GET/api/jokes", () => {
    it("should return bad status without token", async () => {
      const expectedStatus = 401;
      const response = await request(server).get("/api/jokes");
      expect(response.status).toBe(expectedStatus);
      expect(response.type).toEqual("application/json");
    });
  });
  describe("POST/api/register", () => {
    it("should register use with valid creds", async () => {
      const expectedStatus = 201;
      const response = await request(server)
        .post("/api/register")
        .send({ username: "username", password: "password" });
      expect(response.status).toEqual(expectedStatus);
    });
    it("should return bad status with invalid creds", async () => {
      const expectedStatus = 400;
      const response = await request(server)
        .post("/api/register")
        .send({ username: "username" });
      expect(response.status).toBe(expectedStatus);
    });
  });
  describe("POST/api/login", () => {
    it("should return token with successful login", async () => {
      await Users.add({
        username: "username1",
        password: "$2a$08$3vqAjmEZWsjLkhKPBTYQTulXOK...4Q.O/Ep1DifoMT1GSzfBkbim"
      });
      const expectedStatus = 200;
      const response = await request(server)
        .post("/api/login")
        .send({ username: "username1", password: "password1" });
      const bodyArray = Object.keys(response.body);
      expect(response.status).toBe(expectedStatus);
      expect(bodyArray).toEqual(expect.arrayContaining(["message", "token"]));
    });
  });
});
