import { PostgresHelper } from "../../../db/postgres/helper.js";
import type { User } from "../../../entities/user.entity.js";
import type { GetUserByEmailRepositoryInterface } from "../../interfaces/user/get-user-by-email.js";

export class PostgresGetUserByEmailRepository implements GetUserByEmailRepositoryInterface {
  async execute(email: string): Promise<User | null> {
    const users = await PostgresHelper.query<User>("SELECT * FROM users where email = $1", [email]);

    const [user] = users;
    return user ?? null;
  }
}
