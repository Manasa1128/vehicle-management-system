import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/utils/prisma";

describe("Admin Dashboard", () => {
  let adminToken: string;
  let userToken: string;

  // ==================== SETUP ====================

  beforeAll(async () => {
    const password = "123456";

    // ==================== CREATE ADMIN ====================

    const adminEmail = `admin${Date.now()}@gmail.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Admin",
        email: adminEmail,
        password,
      });

    // Change role to ADMIN
    await prisma.user.update({
      where: {
        email: adminEmail,
      },
      data: {
        role: "ADMIN",
      },
    });

    // Login admin after changing role
    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: adminEmail,
        password,
      });

    adminToken = adminLogin.body.token;

    // ==================== CREATE NORMAL USER ====================

    const userEmail = `user${Date.now()}@gmail.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: userEmail,
        password,
      });

    // Login normal user
    const userLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: userEmail,
        password,
      });

    userToken = userLogin.body.token;
  });

  // ==================== GET ALL USERS ====================

  it("should allow admin to get all users", async () => {
    const response = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

    expect(response.body.message).toBe(
      "Users fetched successfully"
    );

    expect(response.body.users).toBeInstanceOf(Array);

    expect(response.body.users.length).toBeGreaterThan(0);

    // Password must never be returned
    if (response.body.users.length > 0) {
      expect(response.body.users[0]).not.toHaveProperty(
        "password"
      );
    }
  });

  // ==================== GET ALL VEHICLES ====================

  it("should allow admin to get all vehicles", async () => {
    const response = await request(app)
      .get("/api/admin/vehicles")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

    expect(response.body.message).toBe(
      "Vehicles fetched successfully"
    );

    expect(response.body.vehicles).toBeInstanceOf(Array);
  });

  // ==================== GET ALL PURCHASES ====================

  it("should allow admin to get all purchases", async () => {
    const response = await request(app)
      .get("/api/admin/purchases")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

    expect(response.body.message).toBe(
      "Purchases fetched successfully"
    );

    expect(response.body.purchases).toBeInstanceOf(
      Array
    );
  });

  // ==================== GET ADMIN STATS ====================

  it("should allow admin to get dashboard statistics", async () => {
    const response = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

    expect(response.body.message).toBe(
      "Admin statistics fetched successfully"
    );

    expect(response.body.stats).toHaveProperty(
      "totalUsers"
    );

    expect(response.body.stats).toHaveProperty(
      "totalVehicles"
    );

    expect(response.body.stats).toHaveProperty(
      "totalPurchases"
    );

    expect(response.body.stats).toHaveProperty(
      "totalVehicleStock"
    );

    expect(response.body.stats).toHaveProperty(
      "totalRevenue"
    );
  });

  // ==================== NORMAL USER - USERS ====================

  it("should prevent normal user from getting all users", async () => {
    const response = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);

    expect(response.body.message).toBe(
      "Admin access required"
    );
  });

  // ==================== NORMAL USER - VEHICLES ====================

  it("should prevent normal user from getting all vehicles", async () => {
    const response = await request(app)
      .get("/api/admin/vehicles")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);

    expect(response.body.message).toBe(
      "Admin access required"
    );
  });

  // ==================== NORMAL USER - PURCHASES ====================

  it("should prevent normal user from getting all purchases", async () => {
    const response = await request(app)
      .get("/api/admin/purchases")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);

    expect(response.body.message).toBe(
      "Admin access required"
    );
  });

  // ==================== NORMAL USER - STATS ====================

  it("should prevent normal user from getting admin stats", async () => {
    const response = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);

    expect(response.body.message).toBe(
      "Admin access required"
    );
  });

  // ==================== NO TOKEN - USERS ====================

  it("should reject users request without token", async () => {
    const response = await request(app)
      .get("/api/admin/users");

    expect(response.status).toBe(401);

    expect(response.body.message).toBe(
      "Authorization token is required"
    );
  });

  // ==================== NO TOKEN - VEHICLES ====================

  it("should reject vehicles request without token", async () => {
    const response = await request(app)
      .get("/api/admin/vehicles");

    expect(response.status).toBe(401);

    expect(response.body.message).toBe(
      "Authorization token is required"
    );
  });

  // ==================== NO TOKEN - PURCHASES ====================

  it("should reject purchases request without token", async () => {
    const response = await request(app)
      .get("/api/admin/purchases");

    expect(response.status).toBe(401);

    expect(response.body.message).toBe(
      "Authorization token is required"
    );
  });

  // ==================== NO TOKEN - STATS ====================

  it("should reject stats request without token", async () => {
    const response = await request(app)
      .get("/api/admin/stats");

    expect(response.status).toBe(401);

    expect(response.body.message).toBe(
      "Authorization token is required"
    );
  });
});