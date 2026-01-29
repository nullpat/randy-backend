export class ApplicationError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = this.constructor.name;
        this.originalError = originalError;
        this.date = new Date();
    }
}

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.date = new Date();
    }
}