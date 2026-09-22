import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import type { UpdateUserDTO } from "../../../schemas/users/update-user.schema.js";
import type { User } from "../../../entities/user.entity.js";
import type { UpdateUserRepositoryInterface } from "../../interfaces/user/update-user.js";
import { UserNotFoundError } from "../../../erros/userId.js";
import { prisma } from "../../../../prisma/prisma.js";
import { stripUndefinedProperties } from "../../../utils/strip-undefined-properties.js";

export class PostgresUpdateUserRepository implements UpdateUserRepositoryInterface {
  async execute(userId: string, updateUserParams: UpdateUserDTO): Promise<User> {
    const updateUserData = stripUndefinedProperties(updateUserParams);

    try {
      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: updateUserData,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
        throw new UserNotFoundError(userId);
      }

      throw error;
    }
  }
}
