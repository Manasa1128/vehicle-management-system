import bcrypt from "bcrypt";

import { createUser } from "../repositories/user.repository";

// ==================== REGISTER USER ====================

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  // Hash password before storing it
  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  // Create user in database
  const user = await createUser(
    name,
    email,
    hashedPassword
  );

  return user;
};