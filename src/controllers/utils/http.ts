import type { Request } from "express";

export type TypedRequestQuery<T> = Request<
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  T
>;
