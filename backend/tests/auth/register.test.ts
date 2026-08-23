import request from "supertest";
import app from "../../src/app";

describe("User Registration", () => {
  it("should register a new user with valid details", async () => {
    const email = `testuser${Date.now()}@gmail.com`;

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: email,
        password: "123456",
      });

    expect(response.status).toBe(201);

    expect(response.body.message).toBe(
      "User registered successfully"
    );

    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.name).toBe("Test User");
    expect(response.body.user.email).toBe(email);

    // Password should not be returned
    expect(response.body.user).not.toHaveProperty(
      "password"
    );
  });
});