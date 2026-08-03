import type { User } from "../../entities/user.entity.js";
import type { GetUserByIdRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-id.js";
import type { getUserByIdServiceInterface } from "../interfaces/user/get-user-by-id.js";

export class GetUserByIdService implements getUserByIdServiceInterface {
  constructor(private readonly getUserByIdRepository: GetUserByIdRepositoryInterface) {}
  async execute(userId: string): Promise<User | null> {
    const user = await this.getUserByIdRepository.execute(userId);

    return user;
  }
}
