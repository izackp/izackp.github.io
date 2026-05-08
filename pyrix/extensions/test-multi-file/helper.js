/**
 * Helper module for testing multi-file extension
 */
export function helperFunction() {
    return "Hello from helper module!";
}
export class HelperClass {
    constructor(message) {
        this.message = message;
    }
    getMessage() {
        return `Helper says: ${this.message}`;
    }
}
export const helperConstant = "This is a constant from helper";
