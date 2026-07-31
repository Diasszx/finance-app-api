import { PostgresHelper } from "../../db/postgres/helper.js";
import type { UpdateUserDTO } from "../../schemas/users/update-user.schema.js";
import type { User } from "../../entities/user.entity.js";
import type { UpdateUserRepositoryInterface } from "../interfaces/update-user.js";

export class PostgresUpdateUserRepository implements UpdateUserRepositoryInterface {
  async execute(userId: string, updateUser: UpdateUserDTO): Promise<User | undefined> {
    const updateFields: string[] = [];
    const updateValues: unknown[] = [];

    const fieldMap: Record<keyof UpdateUserDTO, string> = {
      firstName: "first_name",
      lastName: "last_name",
      email: "email",
      password: "password",
    };

    for (const [key, value] of Object.entries(updateUser) as [
      keyof UpdateUserDTO,
      UpdateUserDTO[keyof UpdateUserDTO],
    ][]) {
      if (value === undefined) continue;
      const dbField = fieldMap[key];

      updateFields.push(`${dbField} = $${updateValues.length + 1}`);
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
