import { randomUUID } from "node:crypto";

export class UniqueEntityID {
  private value: string;

  toString(): string {
    return this.value;
  }

  toValue(): string {
    return this.value;
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }
}