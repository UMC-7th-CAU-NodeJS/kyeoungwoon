export class AlreadyExistError extends Error {
  constructor(message) {
    super(message);
    this.name = "AlreadyExistError";
  }
}

export class NotExistError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotExistError";
  }
}
