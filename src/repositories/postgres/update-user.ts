import { PostgresHelper } from "../../db/postgres/helper.js";
import type { UpdateUserDTO } from "../../schemas/update-user.schema.js";
import type { User } from "../../entities/user.entity.js";

export class PostgresUpdateUserRepository {
  async execute(userId: string, updateUser: UpdateUserDTO): Promise<User | undefined> {
    const updateFields: string[] = [];
    const updateValues: unknown[] = [];

    for (const [key, value] of Object.entries(updateUser) as [
      keyof UpdateUserDTO,
      UpdateUserDTO[keyof UpdateUserDTO],
    ][]) {
      if (value === undefined) continue;

      updateFields.push(`${key} = $${updateValues.length + 1}`);
      updateValues.push(value);
    }

    if (updateFields.length === 0) {
      throw new Error("Nenhum campo para atualizar.");
    }

    updateValues.push(userId);

    const updateQuery = `
      UPDATE users
      SET ${updateFields.join(", ")}
      WHERE id = $${updateValues.length}    
      RETURNING *;
    `;

    const updatedUser = await PostgresHelper.query<User>(updateQuery, updateValues);
    const [user] = updatedUser;

    return user;
  }
}
