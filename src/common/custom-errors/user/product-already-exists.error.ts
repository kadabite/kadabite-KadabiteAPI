export class ProductAlreadyExistsError extends Error {
    constructor(message='Product already exist!') {
        super(message);
        this.name = 'ProductAlreadyExistsError';
    }
}