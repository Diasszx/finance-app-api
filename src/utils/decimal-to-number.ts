import type { Prisma } from "../generated/prisma/client.js";

export function decimalToNumber(value: Prisma.Decimal | null): number {
  return value?.toNumber() ?? 0;
}
