"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateWithCursor = void 0;
const hex_string_1 = require("./hex_string");
/// This function is a helper for paginating using a function wrapping an API
async function paginateWithCursor(apiFunction, accountAddress, limitPerRequest, query) {
    const out = [];
    let cursor;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // eslint-disable-next-line no-await-in-loop
        const response = await apiFunction(hex_string_1.HexString.ensure(accountAddress).hex(), query?.ledgerVersion?.toString(), cursor, limitPerRequest);
        // Response is the main response, i.e. the T[]. Attached to that are the headers as `__headers`.
        // eslint-disable-next-line no-underscore-dangle
        cursor = response.__headers["x-aptos-cursor"];
        // Now that we have the cursor (if any), we remove the headers before
        // adding these to the output of this function.
        // eslint-disable-next-line no-underscore-dangle
        delete response.__headers;
        out.push(...response);
        if (cursor === null || cursor === undefined) {
            break;
        }
    }
    return out;
}
exports.paginateWithCursor = paginateWithCursor;
//# sourceMappingURL=pagination_helpers.js.map