import type { User } from "../../../entities/user.entity.js";

export interface CreateUserRepositoryInterface {
  execute(data: User): Promise<User>;
}
