import { prisma } from "../../../../prisma/prisma.js";
import type { User } from "../../../entities/user.entity.js";
import type { CreateUserRepositoryInterface } from "../../interfaces/user/create-user.js";

export class PostgresCreateUserRepository implements CreateUserRepositoryInterface {
  async execute(createUserParams: User): Promise<User> {
    const user = await prisma.user.create({
      data: {
        ...createUserParams,
      },
    });

    return user;
  }
}
