import { faker } from "@faker-js/faker";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { jest } from "@jest/globals";
import { prisma } from "../../../../prisma/prisma.js";
import { UserNotFoundError } from "../../../erros/userId.js";
import { user as fakeUser } from "../../../tests/index.js";
import { PostgresUpdateUserRepository } from "./update-user.js";

describe("PostgresUpdateUserRepository", () => {
  const updateUserParams = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  it("should update user on db", async () => {
    const user = await prisma.user.create({ data: fakeUser });
    const sut = new PostgresUpdateUserRepository();

    const result = await sut.execute(user.id, updateUserParams);

    expect(result).toStrictEqual({ ...user, ...updateUserParams });
  });

  it("should call Prisma with correct params", async () => {
    const user = await prisma.user.create({ data: fakeUser });
    const sut = new PostgresUpdateUserRepository();
    const prismaSpy = jest.spyOn(prisma.user, "update");

    await sut.execute(user.id, updateUserParams);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: user.id,
      },
      data: updateUserParams,
    });
  });

  it("should throw if Prisma throws", async () => {
    const sut = new PostgresUpdateUserRepository();
    jest.spyOn(prisma.user, "update").mockRejectedValueOnce(new Error());

    const promise = sut.execute(fakeUser.id, updateUserParams);

    await expect(promise).rejects.toThrow();
  });

  it("should throw UserNotFoundError if Prisma does not find record to update", async () => {
    const sut = new PostgresUpdateUserRepository();
    jest.spyOn(prisma.user, "update").mockRejectedValueOnce(
      new PrismaClientKnownRequestError("", {
        code: "P2025",
        clientVersion: "7.9.1",
      }),
    );

    const promise = sut.execute(fakeUser.id, updateUserParams);

    await expect(promise).rejects.toThrow(new UserNotFoundError(fakeUser.id));
  });
});
