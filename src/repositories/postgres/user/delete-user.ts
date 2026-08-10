import { prisma } from "../../../../prisma/prisma.js";
import type { User } from "../../../entities/user.entity.js";
import type { DeleteUserRepositoryInterface } from "../../interfaces/user/delete-user.js";

export class PostgresDeleteUserRepository implements DeleteUserRepositoryInterface {
  async execute(userId: string): Promise<User | null> {
    const user = prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return user ?? null;
  }
}
