import type { CreateUserDTO } from "../../schemas/users/create-user.schema.js";
import type { User } from "../../entities/user.entity.js";
import { EmailAlreadyInUseError } from "../../erros/email.js";
import type { GetUserByEmailRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-email.js";
import type { CreateUserRepositoryInterface } from "../../repositories/interfaces/user/create-user.js";
import type { CreateUserServiceInterface } from "../interfaces/user/create-user.js";
import type { IdGeneratorInterface } from "../../adapters/interfaces/id-generatorInterface.js";
import type { PasswordHasherInterface } from "../../adapters/interfaces/passwordHasherInterface.js";
export class CreateUserService implements CreateUserServiceInterface {
  constructor(
    private readonly createUserRepository: CreateUserRepositoryInterface,
    private readonly getUserByEmailRepository: GetUserByEmailRepositoryInterface,
    private readonly passwordHasherAdapter: PasswordHasherInterface,
    private readonly idGeneratorAdapter: IdGeneratorInterface,
  ) {}

  async execute(user: CreateUserDTO): Promise<User> {
    const userWithProvidedEmail = await this.getUserByEmailRepository.execute(user.email);
    if (userWithProvidedEmail) {
      throw new EmailAlreadyInUseError(user.email);
    }
    const userId = this.idGeneratorAdapter.execute();
    const hashedPassword = await this.passwordHasherAdapter.execute(user.password);
    const userEntity: User = {
      ...user,
      id: userId,
      password: hashedPassword,
    };
    const createdUser = await this.createUserRepository.execute(userEntity);
    return createdUser;
  }
}
