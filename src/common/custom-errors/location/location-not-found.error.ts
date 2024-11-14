export class LocationNotFoundError extends Error {
    constructor(message: string = 'Location not found!') {
      super(message);
      this.name = 'LocationNotFoundError';
    }
  }