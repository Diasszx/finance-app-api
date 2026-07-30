import { PostgresHelper } from "../db/postgres/helper.js";

export class DeleteUserRepository {
  async execute(userId: string) {
    const users = await PostgresHelper.query("DELETE FROM users where id = $1", [userId]);

    const [user] = users;
    return user;
  }
}
