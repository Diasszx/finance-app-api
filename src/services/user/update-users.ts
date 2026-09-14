import { EmailAlreadyInUseError } from "../../erros/email.js";
import type { UpdateUserRepositoryInterface } from "../../repositories/interfaces/user/update-user.js";
import type { UpdateUserDTO } from "../../schemas/users/update-user.schema.js";
import bcrypt from "bcrypt";
import type { updateUserServiceInterface } from "../interfaces/user/update-user.js";
import type { User } from "../../entities/user.entity.js";
import type { GetUserByEmailRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-email.js";
import type { PasswordHasherAdapter } from "../../adapters/passwordHasherAdapter.js";

export class UpdateUserService implements updateUserServiceInterface {
  constructor(
    private readonly updateUserRepository: UpdateUserRepositoryInterface,
    private readonly getUserByEmail: GetUserByEmailRepositoryInterface,
    private readonly passwordHasher: PasswordHasherAdapter,
  ) {}
  async execute(userId: string, updateUsers: UpdateUserDTO): Promise<User | null> {
    if (updateUsers.email) {
      const userWithProvidedEmail = await this.getUserByEmail.execute(updateUsers.email);
      if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
        throw new EmailAlreadyInUseError(updateUsers.email);
      }
    }
    const user = {
      ...updateUsers,
    };
    if (updateUsers.password) {
      const hashedPassword = await this.passwordHasher.execute(updateUsers.password);
      user.password = hashedPassword;
    }

    const updatedUser = await this.updateUserRepository.execute(userId, user);

    return updatedUser;
  }
}
