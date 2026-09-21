import { faker } from "@faker-js/faker";
import { TransactionType } from "../../generated/prisma/enums.js";
import type { Transaction } from "../../entities/transaction.entity.js";

export const transaction: Transaction = {
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  title: faker.string.alpha({ length: 10 }),
  date: faker.date.future().toISOString().slice(0, 10),
  amount: faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
  type: faker.helpers.arrayElement(Object.values(TransactionType)),
};
