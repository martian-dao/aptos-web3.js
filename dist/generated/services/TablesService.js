"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablesService = void 0;
class TablesService {
    constructor(httpRequest) {
        this.httpRequest = httpRequest;
    }
    /**
     * Get table item
     * Get a table item from the table identified by {table_handle} in the
     * path and the "key" (TableItemRequest) provided in the request body.
     *
     * This is a POST endpoint because the "key" for requesting a specific
     * table item (TableItemRequest) could be quite complex, as each of its
     * fields could themselves be composed of other structs. This makes it
     * impractical to express using query params, meaning GET isn't an option.
     * @param tableHandle
     * @param requestBody
     * @param ledgerVersion
     * @returns MoveValue
     * @throws ApiError
     */
    getTableItem(tableHandle, requestBody, ledgerVersion) {
        return this.httpRequest.request({
            method: 'POST',
            url: '/tables/{table_handle}/item',
            path: {
                'table_handle': tableHandle,
            },
            query: {
                'ledger_version': ledgerVersion,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
exports.TablesService = TablesService;
//# sourceMappingURL=TablesService.js.map