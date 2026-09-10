import bcrypt from "bcrypt";

export class PasswordHasherAdapter {
  async execute(password: string) {
    const passwordhashed = await bcrypt.hash(password, 10);
    return passwordhashed;
  }
}
