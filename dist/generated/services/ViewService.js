"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewService = void 0;
class ViewService {
    constructor(httpRequest) {
        this.httpRequest = httpRequest;
    }
    /**
     * Execute view function of a module
     * Execute the Move function with the given parameters and return its execution result.
     *
     * The Aptos nodes prune account state history, via a configurable time window.
     * If the requested ledger version has been pruned, the server responds with a 410.
     * @param requestBody
     * @param ledgerVersion Ledger version to get state of account
     *
     * If not provided, it will be the latest version
     * @returns MoveValue
     * @throws ApiError
     */
    view(requestBody, ledgerVersion) {
        return this.httpRequest.request({
            method: 'POST',
            url: '/view',
            query: {
                'ledger_version': ledgerVersion,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
exports.ViewService = ViewService;
//# sourceMappingURL=ViewService.js.map