export class ApiDeleteError extends Error {
    constructor(message: string) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ApiDeleteError.prototype);
    }
}