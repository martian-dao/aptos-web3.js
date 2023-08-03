"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateWithCursor = void 0;
const client_1 = require("../client");
/// This function is a helper for paginating using a function wrapping an API
async function paginateWithCursor(options) {
    const out = [];
    let cursor;
    const requestParams = options.params;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        requestParams.start = cursor;
        // eslint-disable-next-line no-await-in-loop
        const response = await (0, client_1.get)({
            url: options.url,
            endpoint: options.endpoint,
            params: requestParams,
            originMethod: options.originMethod,
            overrides: options.overrides,
        });
        // eslint-disable-next-line no-underscore-dangle
        /**
         * the cursor is a "state key" from the API prespective. Client
         * should not need to "care" what it represents but just use it
         * to query the next chunck of data.
         */
        cursor = response.headers["x-aptos-cursor"];
        // Now that we have the cursor (if any), we remove the headers before
        // adding these to the output of this function.
        // eslint-disable-next-line no-underscore-dangle
        delete response.headers;
        out.push(...response.data);
        if (cursor === null || cursor === undefined) {
            break;
        }
    }
    return out;
}
exports.paginateWithCursor = paginateWithCursor;
//# sourceMappingURL=pagination_helpers.js.map