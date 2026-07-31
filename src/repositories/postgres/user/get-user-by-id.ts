import { PostgresHelper } from "../../../db/postgres/helper.js";
import type { User } from "../../../entities/user.entity.js";
import type { GetUserByIdRepositoryInterface } from "../../interfaces/get-user-by-id.js";

export class PostgresGetUserByIdRepository implements GetUserByIdRepositoryInterface {
  async execute(userId: string): Promise<User | null> {
    const users = await PostgresHelper.query<User>("SELECT * FROM users where id = $1", [userId]);

    const [user] = users;

    return user ?? null;
  }
}
