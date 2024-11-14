export class UnauthorizedError extends Error {
    constructor(message: string = 'You need to be an admin to access this route!') {
      super(message);
      this.name = 'UnauthorizedError';
    }
  }