import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { PostgresCreateUserRepository } from "../repositories/postgres/create-user.js";
import type { CreateUserDTO } from "../dtos/users/create-user.dto.js";
import type { User } from "../entities/user.entity.js";

export class CreateUserService {
  async execute(user: CreateUserDTO): Promise<User> {
    // TO DO: VERIFICAR SE EMAIL JÁ ESTÁ CADASTRADO!
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createUser = {
      ...user,
      id: userId,
      password: hashedPassword,
    };

    const repository = new PostgresCreateUserRepository();
    const createdUser = await repository.execute(createUser);
    return createUser;
  }
}
