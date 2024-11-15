export class InvalidCredentialsError extends Error {
    constructor(message='Invalid credentials') {
      super(message);
      this.name = 'InvalidCredentialsError';
    }
  }

export class InvalidInputError extends Error {
  constructor(message='invalid input') {
    super(message);
    this.name = 'InvalidInputError';
  }
}
