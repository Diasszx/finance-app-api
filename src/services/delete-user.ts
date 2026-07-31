import type { User } from "../entities/user.entity.js";
import type { DeleteUserRepositoryInterface } from "../repositories/interfaces/delete-user.js";
import type { DeleteUserServiceInterface } from "./interfaces/delete-user.js";

export class DeleteUserService implements DeleteUserServiceInterface {
  constructor(private readonly deleteUserRepository: DeleteUserRepositoryInterface) {}
  async execute(userId: string): Promise<User | null> {
    const user = await this.deleteUserRepository.execute(userId);
    return user;
  }
}
