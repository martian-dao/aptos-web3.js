"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosApiError = void 0;
/**
 * The type returned from an API error
 */
class AptosApiError extends Error {
    constructor(request, response, message) {
        super(message);
        this.name = "AptosApiError";
        this.url = response.url;
        this.status = response.status;
        this.statusText = response.statusText;
        this.data = response.data;
        this.request = request;
    }
}
exports.AptosApiError = AptosApiError;
//# sourceMappingURL=types.js.map