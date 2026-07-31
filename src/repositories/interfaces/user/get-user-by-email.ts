import type { User } from "../../../entities/user.entity.js";

export interface GetUserByEmailRepositoryInterface {
  execute(email: string): Promise<User | null>;
}
