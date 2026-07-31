import type { User } from "../../../entities/user.entity.js";

export interface GetUserByIdRepositoryInterface {
  execute(userId: string): Promise<User | null>;
}
