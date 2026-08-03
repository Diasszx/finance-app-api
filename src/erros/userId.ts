export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`O id: ${userId} não existe.`);
    this.name = "UserNotFoundError";
  }
}
