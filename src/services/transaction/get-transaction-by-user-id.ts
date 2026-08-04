import { UserNotFoundError } from "../../erros/userId.js";
import type { GetTransactionByUserIdInterface } from "../../repositories/interfaces/transaction/get-transaction-by-user-id.js";
import type { GetUserByIdRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-id.js";

export class GetTransactionByUserIdService {
  constructor(
    private readonly getTransactionByUserIdRepository: GetTransactionByUserIdInterface,
    private readonly getUserByIdRepository: GetUserByIdRepositoryInterface,
  ) {}
  async execute(userId: string) {
    const user = await this.getUserByIdRepository.execute(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    const transactions = this.getTransactionByUserIdRepository.execute(userId);
    return transactions;
  }
}
