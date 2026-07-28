import { PostgresGetUserByIdRepository } from "../repositories/postgres/get-user-by-id.js";

export class GetUserByIdService {
  async execute(userId: string) {
    const repository = new PostgresGetUserByIdRepository();

    const user = await repository.execute(userId);

    return user;
  }
}
