export class ApiPatchError extends Error {
    constructor(message: string) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ApiPatchError.prototype);
    }
}