export class InvalidPaymentMethodError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPaymentMethodError';
  }
}
export class InvalidCurrencyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidCurrencyError';
    }
} 
export class InvalidAmountError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidAmountError';
    }
}