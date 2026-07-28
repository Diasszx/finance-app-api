import { PostgresHelper } from "../../db/postgres/helper.js";
import type { User } from "../../entities/user.entity.js";

export class PostgresCreateUserRepository {
  async execute(user: User): Promise<User> {
    const result = await PostgresHelper.query<User>(
      "INSERT INTO users (ID, first_name,last_name,email,password) VALUES ($1,$2,$3,$4,$5) RETURNING *;",
      [user.id, user.firstName, user.lastName, user.email, user.password],
    );
    const [createdUser] = result;

    if (!createdUser) {
      throw new Error("Falha ao criar usuário.");
    }

    return createdUser;
  }
}
