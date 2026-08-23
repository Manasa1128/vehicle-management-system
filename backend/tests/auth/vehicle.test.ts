import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/utils/prisma";

describe("Vehicle Management", () => {
  let adminToken: string;
  let userToken: string;
  let vehicleId: number;

  // ==================== SETUP ====================

  beforeAll(async () => {
    // ==================== CREATE ADMIN USER ====================

    const adminEmail = `admin${Date.now()}@gmail.com`;
    const password = "123456";

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin User",
        email: adminEmail,
        password,
      });

    // Change registered user role to ADMIN
    await prisma.user.update({
      where: {
        email: adminEmail,
      },
      data: {
        role: "ADMIN",
      },
    });

    // Login admin AFTER changing role
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
        name: "Normal User",
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

  // ==================== CREATE VEHICLE ====================

  it("should create a vehicle as admin", async () => {
    const response = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 3500000,
        quantity: 5,
      });

    expect(response.status).toBe(201);

    expect(response.body.message).toBe(
      "Vehicle created successfully"
    );

    expect(response.body.vehicle).toHaveProperty("id");

    expect(response.body.vehicle.make).toBe("Toyota");

    expect(response.body.vehicle.model).toBe(
      "Fortuner"
    );

    expect(response.body.vehicle.category).toBe("SUV");

    expect(response.body.vehicle.price).toBe(3500000);

    expect(response.body.vehicle.quantity).toBe(5);

    vehicleId = response.body.vehicle.id;
  });

  // ==================== GET ALL VEHICLES ====================

  it("should get all vehicles", async () => {
    const response = await request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);

    expect(response.body.message).toBe(
      "Vehicles fetched successfully"
    );

    expect(response.body.vehicles).toBeInstanceOf(
      Array
    );

    expect(response.body.vehicles.length).toBeGreaterThan(
      0
    );
  });

  // ==================== GET VEHICLE BY ID ====================

  it("should get vehicle by ID", async () => {
    const response = await request(app)
      .get(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);

    expect(response.body.message).toBe(
      "Vehicle fetched successfully"
    );

    expect(response.body.vehicle.id).toBe(vehicleId);

    expect(response.body.vehicle.make).toBe("Toyota");

    expect(response.body.vehicle.model).toBe(
      "Fortuner"
    );
  });

  // ==================== UPDATE VEHICLE ====================

  it("should update a vehicle as admin", async () => {
    const response = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        make: "Toyota",
        model: "Fortuner Legender",
        category: "SUV",
        price: 4000000,
        quantity: 10,
      });

    expect(response.status).toBe(200);

    expect(response.body.message).toBe(
      "Vehicle updated successfully"
    );

    expect(response.body.vehicle.id).toBe(vehicleId);

    expect(response.body.vehicle.model).toBe(
      "Fortuner Legender"
    );

    expect(response.body.vehicle.price).toBe(4000000);

    expect(response.body.vehicle.quantity).toBe(10);
  });

  // ==================== USER CANNOT CREATE VEHICLE ====================

  it("should prevent normal user from creating vehicle", async () => {
    const response = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        make: "Honda",
        model: "City",
        category: "Sedan",
        price: 1500000,
        quantity: 5,
      });

    expect(response.status).toBe(403);

    expect(response.body.message).toBe(
      "Admin access required"
    );
  });

  // ==================== USER CANNOT UPDATE VEHICLE ====================

  it("should prevent normal user from updating vehicle", async () => {
    const response = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        make: "Honda",
        model: "City",
        category: "Sedan",
        price: 1500000,
        quantity: 5,
      });

    expect(response.status).toBe(403);

    expect(response.body.message).toBe(
      "Admin access required"
    );
  });

  // ==================== USER CANNOT DELETE VEHICLE ====================

  it("should prevent normal user from deleting vehicle", async () => {
    const response = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);

    expect(response.body.message).toBe(
      "Admin access required"
    );
  });

  // ==================== DELETE VEHICLE ====================

  it("should delete a vehicle as admin", async () => {
    const response = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

    expect(response.body.message).toBe(
      "Vehicle deleted successfully"
    );
  });

  // ==================== GET DELETED VEHICLE ====================

  it("should return 404 for deleted vehicle", async () => {
    const response = await request(app)
      .get(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(404);

    expect(response.body.message).toBe(
      "Vehicle not found"
    );
  });

  // ==================== UNAUTHORIZED ACCESS ====================

  it("should reject request without token", async () => {
    const response = await request(app)
      .get("/api/vehicles");

    expect(response.status).toBe(401);

    expect(response.body.message).toBe(
      "Authorization token is required"
    );
  });
});