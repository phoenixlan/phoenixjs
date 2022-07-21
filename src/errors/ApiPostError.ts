export class ApiPostError extends Error {
    constructor(message: string) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ApiPostError.prototype);
    }
}