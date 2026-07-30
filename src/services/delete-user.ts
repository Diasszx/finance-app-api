import { DeleteUserRepository } from "../repositories/delete-user.js";

export class DeleteUserService {
  async execute(userId: string) {
    const repository = new DeleteUserRepository();
    const user = await repository.execute(userId);
    return user;
  }
}
