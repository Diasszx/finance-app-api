import type { User } from "../../../entities/user.entity.js";
import type { UpdateUserDTO } from "../../../schemas/users/update-user.schema.js";

export interface updateUserServiceInterface {
  execute(userId: string, updateUsers: UpdateUserDTO): Promise<User | null>;
}
