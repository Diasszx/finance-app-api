import { PostgresHelper } from "../../db/postgres/helper.js";
import type { User } from "../../entities/user.entity.js";

export class PostgresGetUserByIdRepository {
  async execute(userId: string): Promise<User> {
    const users = await PostgresHelper.query<User>("SELECT * FROM users where id = $1", [userId]);

    const [user] = users;

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    return user;
  }
}
