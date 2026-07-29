import { PostgresHelper } from "../../db/postgres/helper.js";
import type { User } from "../../entities/user.entity.js";

export class PostgresGetUserByEmailRepository {
  async execute(email: string): Promise<User | undefined> {
    const users = await PostgresHelper.query<User>("SELECT * FROM users where email = $1", [email]);

    const [user] = users;
    return user;
  }
}
