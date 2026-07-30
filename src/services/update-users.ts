import { EmailAlreadyInUseError } from "../erros/user.js";
import { PostgresGetUserByEmailRepository } from "../repositories/postgres/get-user-by-email.js";
import { PostgresUpdateUserRepository } from "../repositories/postgres/update-user.js";
import type { UpdateUserDTO } from "../schemas/users/update-user.schema.js";
import bcrypt from "bcrypt";

export class UpdateUserService {
  async execute(userId: string, updateUsers: UpdateUserDTO) {
    if (updateUsers.email) {
      const postgresGetUserByEmailRepository = new PostgresGetUserByEmailRepository();

      const userWithProvidedEmail = await postgresGetUserByEmailRepository.execute(
        updateUsers.email,
      );
      if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
        throw new EmailAlreadyInUseError(updateUsers.email);
      }
    }
    const user = {
      ...updateUsers,
    };
    if (updateUsers.password) {
      const hashedPassword = await bcrypt.hash(updateUsers.password, 10);
      user.password = hashedPassword;
    }

    const postgresUpdateUserRepository = new PostgresUpdateUserRepository();
    const updatedUser = await postgresUpdateUserRepository.execute(userId, user);

    return updatedUser;
  }
}
