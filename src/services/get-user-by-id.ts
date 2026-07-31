import { PostgresGetUserByIdRepository } from "../repositories/postgres/get-user-by-id.js";

export class GetUserByIdService {
  constructor(private readonly repository: PostgresGetUserByIdRepository) {}
  async execute(userId: string) {
    const user = await this.repository.execute(userId);

    return user;
  }
}
