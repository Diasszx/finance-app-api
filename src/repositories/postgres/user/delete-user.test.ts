import { prisma } from "../../../../prisma/prisma.js";
import { user } from "../../../tests/index.js";
import { PostgresDeleteUserRepository } from "./delete-user.js";

describe("PostgresDeleteUserRepository", () => {
  it("should delete a user on db", async () => {
    const createdUser = await prisma.user.create({
      data: user,
    });

    const sut = new PostgresDeleteUserRepository();

    const result = await sut.execute(createdUser.id);

    expect(result).toStrictEqual(createdUser);
  });
});
