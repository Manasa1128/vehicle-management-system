import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/utils/prisma";

describe("Purchase Management", () => {
  let token: string;
  let vehicleId: number;
  let purchaseId: number;

  // ==================== SETUP ====================

  beforeAll(async () => {
    const email = `purchase${Date.now()}@gmail.com`;
    const password = "123456";

    // ==================== REGISTER USER ====================

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Purchase Test User",
        email,
        password,
      });

    // ==================== LOGIN USER ====================

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password,
      });

    token = loginResponse.body.token;

    // ==================== CREATE TEST VEHICLE ====================

    // Vehicle is created directly in database
    // because vehicle creation is now ADMIN-only.

    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Honda",
        model: "City",
        category: "Sedan",
        price: 1500000,
        quantity: 10,
      },
    });

    vehicleId = vehicle.id;
  });

  // ==================== CREATE PURCHASE ====================

  it("should purchase a vehicle", async () => {
    const response = await request(app)
      .post("/api/purchases")
      .set("Authorization", `Bearer ${token}`)
      .send({
        vehicleId,
        quantity: 2,
      });

    expect(response.status).toBe(201);

    expect(response.body.message).toBe(
      "Purchase successful"
    );

    expect(response.body.purchase).toHaveProperty("id");

    expect(response.body.purchase.vehicleId).toBe(
      vehicleId
    );

    expect(response.body.purchase.quantity).toBe(2);

    expect(response.body.purchase.totalPrice).toBe(
      3000000
    );

    purchaseId = response.body.purchase.id;
  });

  // ==================== GET USER PURCHASES ====================

  it("should get user's purchases", async () => {
    const response = await request(app)
      .get("/api/purchases")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.message).toBe(
      "Purchases fetched successfully"
    );

    expect(response.body.purchases).toBeInstanceOf(
      Array
    );

    expect(response.body.purchases.length).toBeGreaterThan(
      0
    );
  });

  // ==================== GET PURCHASE BY ID ====================

  it("should get purchase by ID", async () => {
    const response = await request(app)
      .get(`/api/purchases/${purchaseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.message).toBe(
      "Purchase fetched successfully"
    );

    expect(response.body.purchase.id).toBe(
      purchaseId
    );

    expect(response.body.purchase.vehicleId).toBe(
      vehicleId
    );
  });

  // ==================== CHECK VEHICLE QUANTITY ====================

  it("should reduce vehicle quantity after purchase", async () => {
    const response = await request(app)
      .get(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.vehicle.quantity).toBe(8);
  });

  // ==================== INSUFFICIENT QUANTITY ====================

  it("should reject purchase when quantity is insufficient", async () => {
    const response = await request(app)
      .post("/api/purchases")
      .set("Authorization", `Bearer ${token}`)
      .send({
        vehicleId,
        quantity: 100,
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Insufficient vehicle quantity"
    );
  });

  // ==================== UNAUTHORIZED ====================

  it("should reject purchase without token", async () => {
    const response = await request(app)
      .post("/api/purchases")
      .send({
        vehicleId,
        quantity: 1,
      });

    expect(response.status).toBe(401);

    expect(response.body.message).toBe(
      "Authorization token is required"
    );
  });
});