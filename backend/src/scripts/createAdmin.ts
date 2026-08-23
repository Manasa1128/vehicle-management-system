import bcrypt from "bcrypt";
import prisma from "../utils/prisma";

const createAdmin = async () => {
  try {
    const name = "System Admin";
    const email = "admin@vehicle.com";
    const password = "admin123";

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingAdmin) {
      if (existingAdmin.role === "ADMIN") {
        console.log("Admin already exists.");
        return;
      }

      // Convert existing user to ADMIN
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          role: "ADMIN",
        },
      });

      console.log("Existing user converted to ADMIN.");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin created successfully.");
    console.log("Email:", email);
    console.log("Password:", password);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();