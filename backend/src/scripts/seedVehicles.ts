import prisma from "../utils/prisma";

const vehicles = [
  {
    make: "Toyota",
    model: "Fortuner",
    category: "SUV",
    price: 3500000,
    quantity: 5,
  },
  {
    make: "Mahindra",
    model: "XUV700",
    category: "SUV",
    price: 2600000,
    quantity: 7,
  },
  {
    make: "Honda",
    model: "City",
    category: "Sedan",
    price: 1500000,
    quantity: 8,
  },
  {
    make: "Hyundai",
    model: "i20",
    category: "Hatchback",
    price: 900000,
    quantity: 9,
  },
  {
    make: "Tata",
    model: "Nexon EV",
    category: "Electric",
    price: 1650000,
    quantity: 4,
  },
  {
    make: "Mercedes-Benz",
    model: "C-Class",
    category: "Luxury",
    price: 6200000,
    quantity: 2,
  },
  {
    make: "Isuzu",
    model: "D-Max",
    category: "Truck",
    price: 2400000,
    quantity: 3,
  },
  {
    make: "BMW",
    model: "M4",
    category: "Coupe",
    price: 14500000,
    quantity: 1,
  },
  {
    make: "Maruti Suzuki",
    model: "Dzire",
    category: "Sedan",
    price: 850000,
    quantity: 10,
  },
];

const seedVehicles = async () => {
  try {
    await prisma.purchase.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.vehicle.createMany({ data: vehicles });

    console.log("Vehicle inventory reset successfully.");
    console.log(`Seeded ${vehicles.length} vehicles.`);
  } catch (error) {
    console.error("Error seeding vehicles:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

seedVehicles();
