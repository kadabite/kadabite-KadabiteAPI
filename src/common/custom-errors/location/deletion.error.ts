export class DeletionError extends Error {
    constructor(message: string = 'Could not delete location, try again later.') {
      super(message);
      this.name = 'DeletionError';
    }
  }