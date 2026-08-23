import prisma from "../utils/prisma";

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  return await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
};