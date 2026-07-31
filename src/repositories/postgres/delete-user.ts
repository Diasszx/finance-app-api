import { PostgresHelper } from "../../db/postgres/helper.js";
import type { User } from "../../entities/user.entity.js";
import type { DeleteUserRepositoryInterface } from "../interfaces/delete-user.js";

export class PostgresDeleteUserRepository implements DeleteUserRepositoryInterface {
  async execute(userId: string): Promise<User | null> {
    const users = await PostgresHelper.query<User>("DELETE FROM users where id = $1 RETURNING *;", [
      userId,
    ]);

    const [user] = users;
    return user ?? null;
  }
}
