import { v4 as uuidv4 } from "uuid";
import type { IdGeneratorInterface } from "./interfaces/id-generatorInterface.js";

export class IdGeneratorAdapter implements IdGeneratorInterface {
  execute() {
    return uuidv4();
  }
}
