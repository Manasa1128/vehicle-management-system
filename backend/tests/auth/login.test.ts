import request from "supertest";
import app from "../../src/app";

describe("User Login", () => {
  it("should login with valid credentials", async () => {
    // First register a user
    const email = `login${Date.now()}@gmail.com`;
    const password = "123456";

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Login User",
        email,
        password,
      });

    // Then login
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password,
      });

    expect(response.status).toBe(200);

    expect(response.body.message).toBe(
      "Login successful"
    );

    expect(response.body).toHaveProperty("token");

    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.name).toBe("Login User");
    expect(response.body.user.email).toBe(email);

    // Password should not be returned
    expect(response.body.user).not.toHaveProperty(
      "password"
    );
  });
});