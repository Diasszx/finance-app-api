import type { User } from "../../entities/user.entity.js";

export interface DeleteUserServiceInterface {
  execute(userId: string): Promise<User | null>;
}
