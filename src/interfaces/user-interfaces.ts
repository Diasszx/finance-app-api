import type { User } from "../entities/user.entity.js";
import type { CreateUserDTO } from "../schemas/users/create-user.schema.js";

export interface UserRepositoryInterface {
  create(data: CreateUserDTO): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string): Promise<User>;
  delete(id: string): Promise<User | null>;
}
