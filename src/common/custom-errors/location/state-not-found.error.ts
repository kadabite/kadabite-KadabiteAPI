export class StateNotFoundError extends Error {
    constructor(message: string = 'This state is not available here!') {
      super(message);
      this.name = 'StateNotFoundError';
    }
  }