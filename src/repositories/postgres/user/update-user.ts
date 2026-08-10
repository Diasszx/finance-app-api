import type { UpdateUserDTO } from "../../../schemas/users/update-user.schema.js";
import type { User } from "../../../entities/user.entity.js";
import type { UpdateUserRepositoryInterface } from "../../interfaces/user/update-user.js";
import { prisma } from "../../../../prisma/prisma.js";

export class PostgresUpdateUserRepository implements UpdateUserRepositoryInterface {
  async execute(userId: string, updateUserParams: UpdateUserDTO): Promise<User> {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(updateUserParams.firstName !== undefined && {
          firstName: updateUserParams.firstName,
        }),
        ...(updateUserParams.lastName !== undefined && {
          lastName: updateUserParams.lastName,
        }),
        ...(updateUserParams.email !== undefined && {
          email: updateUserParams.email,
        }),
        ...(updateUserParams.password !== undefined && {
          password: updateUserParams.password,
        }),
      },
    });

    return user;
  }
}
