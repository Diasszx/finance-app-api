import type { User } from "../../../entities/user.entity.js";
import type { CreateUserDTO } from "../../../schemas/users/create-user.schema.js";

export interface CreateUserRepositoryInterface {
  execute(data: CreateUserDTO): Promise<User>;
}
