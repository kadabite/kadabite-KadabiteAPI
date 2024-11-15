export class CategoryNotFoundError extends Error {
    constructor(message='category not found!') {
        super(message);
        this.name = 'CategoryNotFoundError';
    }
}

export class CategoryAlreadyExistsError extends Error {
    constructor(message='Category already exist!') {
        super(message);
        this.name = 'CategoryAlreadyExistsError';
    }
}