export interface PasswordHasherInterface {
  execute(password: string): Promise<string>;
}
