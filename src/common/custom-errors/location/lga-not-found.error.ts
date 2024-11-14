export class LgaNotFoundError extends Error {
    constructor(message: string = 'This LGA is not available here!') {
      super(message);
      this.name = 'LgaNotFoundError';
    }
  }