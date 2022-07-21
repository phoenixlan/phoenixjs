export class InitError extends Error {
    constructor(message: string) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InitError.prototype);
    }
}