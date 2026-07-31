import type { User } from "../../entities/user.entity.js";

export interface getUserByIdServiceInterface {
  execute(userId: string): Promise<User | null>;
}
