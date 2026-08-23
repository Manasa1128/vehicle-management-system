import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/utils/prisma";

describe("Assignment inventory routes", () => {
  let adminToken: string;
  let userToken: string;
  let vehicleId: number;

  beforeAll(async () => {
    const password = "123456";
    const adminEmail = `route-admin${Date.now()}@gmail.com`;
    const userEmail = `route-user${Date.now()}@gmail.com`;

    await request(app).post("/api/auth/register").send({
      name: "Route Admin",
      email: adminEmail,
      password,
    });

    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: "ADMIN" },
    });

    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: adminEmail, password });

    adminToken = adminLogin.body.token;

    const userRegister = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Route User",
        email: userEmail,
        password,
      });

    userToken = userRegister.body.token;

    const vehicle = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        make: "Mahindra",
        model: "XUV700",
        category: "SUV",
        price: 2600000,
        quantity: 4,
      });

    vehicleId = vehicle.body.vehicle.id;
  });

  it("searches vehicles at /api/vehicles/search", async () => {
    const response = await request(app)
      .get("/api/vehicles/search?search=mahindra&category=SUV")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: vehicleId,
          make: "Mahindra",
        }),
      ])
    );
  });

  it("purchases a vehicle at /api/vehicles/:id/purchase", async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 2 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Purchase successful");
    expect(response.body.purchase.vehicleId).toBe(vehicleId);

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    expect(vehicle?.quantity).toBe(2);
  });

  it("restocks a vehicle at /api/vehicles/:id/restock as admin", async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 3 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Vehicle restocked successfully"
    );
    expect(response.body.vehicle.quantity).toBe(5);
  });

  it("blocks restock for normal users", async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 1 });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Admin access required");
  });
});
