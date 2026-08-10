import type { UpdateUserDTO } from "../../../schemas/users/update-user.schema.js";
import type { User } from "../../../entities/user.entity.js";
import type { UpdateUserRepositoryInterface } from "../../interfaces/user/update-user.js";
import { prisma } from "../../../../prisma/prisma.js";
import { stripUndefinedProperties } from "../../../utils/strip-undefined-properties.js";

export class PostgresUpdateUserRepository implements UpdateUserRepositoryInterface {
  async execute(userId: string, updateUserParams: UpdateUserDTO): Promise<User> {
    const updateUserData = stripUndefinedProperties(updateUserParams);
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateUserData,
    });

    return user;
  }
}
