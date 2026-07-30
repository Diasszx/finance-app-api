export class FieldNotExists extends Error {
  constructor(field: string) {
    super(`O campo ${field} não existe.`);
    this.name = "FieldNotExists";
  }
}
