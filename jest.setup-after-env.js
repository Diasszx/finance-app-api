import { prisma } from "./prisma/prisma.js";
import { afterAll, beforeEach } from "@jest/globals";

beforeEach(async () => {
  await prisma.transaction.deleteMany({});
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});
