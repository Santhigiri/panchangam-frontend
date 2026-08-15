export class UnauthorizedError extends Error {
  constructor() {
    super("You need to log in to do this")
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("You don't have permission to do this")
    this.name = "ForbiddenError"
  }
}
