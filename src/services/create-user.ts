import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { PostgresCreateUserRepository } from "../repositories/postgres/create-user.js";
import type { CreateUserDTO } from "../schemas/users/create-user.schema.js";
import type { User } from "../entities/user.entity.js";
import { PostgresGetUserByEmailRepository } from "../repositories/postgres/get-user-by-email.js";
import { EmailAlreadyInUseError } from "../erros/user.js";
export class CreateUserService {
  async execute(user: CreateUserDTO): Promise<User> {
    const postgresGetUserByEmailRepository = new PostgresGetUserByEmailRepository();

    const userWithProvidedEmail = await postgresGetUserByEmailRepository.execute(user.email);

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

    const repository = new PostgresCreateUserRepository();
    const createdUser = await repository.execute(createUser);
    return createdUser;
  }
}
