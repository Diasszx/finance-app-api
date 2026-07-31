import type { User } from "../../../entities/user.entity.js";

export interface DeleteUserRepositoryInterface {
  execute(userId: string): Promise<User | null>;
}
