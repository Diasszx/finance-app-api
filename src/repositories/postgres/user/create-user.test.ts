import { prisma } from "../../../../prisma/prisma.js";
import { jest } from "@jest/globals";
import { user } from "../../../tests/index.js";
import { PostgresCreateUserRepository } from "./create-user.js";

describe("CreateUserRepository", () => {
  it("should create a user on db", async () => {
    const sut = new PostgresCreateUserRepository();

    const result = await sut.execute(user);

    expect(result.id).toBe(user.id);
    expect(result.firstName).toBe(user.firstName);
    expect(result.lastName).toBe(user.lastName);
    expect(result.email).toBe(user.email);
    expect(result.password).toBe(user.password);
  });

  it("should call Prisma with correct params", async () => {
    const sut = new PostgresCreateUserRepository();
    const spyPrisma = jest.spyOn(prisma.user, "create");

    await sut.execute(user);

    expect(spyPrisma).toHaveBeenCalledWith({ data: user });
  });
});
