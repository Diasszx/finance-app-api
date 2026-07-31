import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import type { CreateUserDTO } from "../schemas/users/create-user.schema.js";
import type { User } from "../entities/user.entity.js";
import { EmailAlreadyInUseError } from "../erros/user.js";
import type { GetUserByEmailRepositoryInterface } from "../repositories/interfaces/user/get-user-by-email.js";
import type { CreateUserRepositoryInterface } from "../repositories/interfaces/user/create-user.js";
import type { CreateUserServiceInterface } from "./interfaces/create-user.js";
export class CreateUserService implements CreateUserServiceInterface {
  constructor(
    private readonly createUserRepository: CreateUserRepositoryInterface,
    private readonly getUserByEmailRepository: GetUserByEmailRepositoryInterface,
  ) {}

  async execute(user: CreateUserDTO): Promise<User> {
    const userWithProvidedEmail = await this.getUserByEmailRepository.execute(user.email);
    if (userWithProvidedEmail) {
      throw new EmailAlreadyInUseError(user.email);
    }
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createUser = {
      ...user,
      id: userId,
      password: hashedPassword,
    };
    const createdUser = await this.createUserRepository.execute(createUser);
    return createdUser;
  }
}
