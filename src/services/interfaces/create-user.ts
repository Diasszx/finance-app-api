import type { User } from "../../entities/user.entity.js";
import type { CreateUserDTO } from "../../schemas/users/create-user.schema.js";

export interface CreateUserServiceInterface {
  execute(user: CreateUserDTO): Promise<User>;
}
