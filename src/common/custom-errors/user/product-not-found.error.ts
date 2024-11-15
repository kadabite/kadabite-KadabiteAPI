export class ProductNotFoundError extends Error {
    constructor(message='Product not found!') {
        super(message);
        this.name = 'ProductNotFoundError';
    }
}