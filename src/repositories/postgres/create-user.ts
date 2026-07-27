import { PostgresHelper } from "../../db/postgres/helper.js";
import type { CreateUserDTO } from "../../dtos/create-user.dto.js";
import type { User } from "../../entities/user.entity.js";

export class PostgresCreateUserRepository {
  async execute(user: CreateUserDTO): Promise<User> {
    const result = await PostgresHelper.query<User>(
      "INSERT INTO users (ID, first_name,last_name,email,password) VALUES ($1,$2,$3,$4,$5) RETURNING *;",
      [user.id, user.first_name, user.last_name, user.email, user.password],
    );
    return result[0];
  }
}
