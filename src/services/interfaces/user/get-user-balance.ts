import { UserNotFoundError } from "../../../erros/userId.js";
import type { GetUserBalanceInterface } from "../../../repositories/interfaces/user/get-user-balance.js";
import type { GetUserByIdRepositoryInterface } from "../../../repositories/interfaces/user/get-user-by-id.js";

export class GetUserBalanceService {
  constructor(
    private readonly getUserBalanceRepository: GetUserBalanceInterface,
    private readonly getUserByIdRepository: GetUserByIdRepositoryInterface,
  ) {}

  async execute(userId: string) {
    const user = this.getUserByIdRepository.execute(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    const balance = await this.getUserBalanceRepository.execute(userId);
    return balance;
  }
}
