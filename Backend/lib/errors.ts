/**
 * Centralized custom error classes.
 * Used by all services, caught by the error handler middleware.
 */

/** Thrown when input data fails business validation rules */
export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

/** Thrown when a requested resource does not exist */
export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }
}

/** Thrown when an operation conflicts with existing data (e.g. duplicates) */
export class ConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConflictError';
    }
}
