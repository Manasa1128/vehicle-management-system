import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { registerUser } from "../services/auth.service";
import prisma from "../utils/prisma";

// ==================== REGISTER ====================

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    // ==================== VALIDATION ====================

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // ==================== JWT SECRET ====================

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET is not configured",
      });
    }

    // ==================== NORMALIZE DATA ====================

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // ==================== CHECK EXISTING USER ====================

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // ==================== CREATE USER ====================

    const user = await registerUser(
      normalizedName,
      normalizedEmail,
      password
    );

    // ==================== CREATE JWT ====================

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // ==================== RESPONSE ====================

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==================== LOGIN ====================

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    // ==================== VALIDATION ====================

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // ==================== JWT SECRET ====================

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET is not configured",
      });
    }

    // ==================== NORMALIZE EMAIL ====================

    const normalizedEmail = email.trim().toLowerCase();

    // ==================== FIND USER ====================

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    // ==================== USER NOT FOUND ====================

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ==================== CHECK PASSWORD ====================

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ==================== CREATE JWT ====================

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // ==================== RESPONSE ====================

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};