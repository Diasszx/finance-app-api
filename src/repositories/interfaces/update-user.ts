import type { User } from "../../entities/user.entity.js";
import type { UpdateUserDTO } from "../../schemas/users/update-user.schema.js";

export interface UpdateUserRepositoryInterface {
  execute(userId: string, updateUser: UpdateUserDTO): Promise<User | null>;
}
