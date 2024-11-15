export class UnauthorizedError extends Error {
    constructor(message: string = 'You need to be an admin to access this route!') {
      super(message);
      this.name = 'UnauthorizedError';
    }
  }

export class InvalidTokenError extends Error {
  constructor(message: string = 'Invalide token!') {
    super(message);
    this.name = 'InvalidTokenError';
  }
}

export class TokenExpiredError extends Error {
  constructor(message: string = 'Token has expired!') {
    super(message);
    this.name = 'TokenExpiredError';
  }
}
