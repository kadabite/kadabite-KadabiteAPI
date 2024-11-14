export class CountryNotFoundError extends Error {
    constructor(message: string = 'This country is not available here!') {
      super(message);
      this.name = 'CountryNotFoundError';
    }
  }