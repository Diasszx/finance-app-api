import { PostgresHelper } from "../../db/postgres/helper.js";

export class PostgresGetUserByEmailRepository {
  async execute(email: string) {
    const users = await PostgresHelper.query("SELECT * FROM users where email = $1", [email]);
    if (!users) {
      throw new Error("Email não encontrado.");
    }
    const [user] = users;
    return user;
  }
}
