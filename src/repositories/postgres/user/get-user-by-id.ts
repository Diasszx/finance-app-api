import { prisma } from "../../../../prisma/prisma.js";
import type { User } from "../../../entities/user.entity.js";
import type { GetUserByIdRepositoryInterface } from "../../interfaces/user/get-user-by-id.js";

export class PostgresGetUserByIdRepository implements GetUserByIdRepositoryInterface {
  async execute(userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    return user ?? null;
  }
}
