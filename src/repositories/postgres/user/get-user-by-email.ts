import { prisma } from "../../../../prisma/prisma.js";
import type { User } from "../../../entities/user.entity.js";
import type { GetUserByEmailRepositoryInterface } from "../../interfaces/user/get-user-by-email.js";

export class PostgresGetUserByEmailRepository implements GetUserByEmailRepositoryInterface {
  async execute(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
