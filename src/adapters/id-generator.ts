import { v4 as uuidv4 } from "uuid";

export class IdGenereatorAdapter {
  execute() {
    return uuidv4();
  }
}
