import bcrypt from "bcrypt";
import type { PasswordHasherInterface } from "./interfaces/passwordHasherInterface.js";

export class PasswordHasherAdapter implements PasswordHasherInterface {
  async execute(password: string) {
    const passwordhashed = await bcrypt.hash(password, 10);
    return passwordhashed;
  }
}
