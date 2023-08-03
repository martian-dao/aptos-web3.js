"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const core_1 = require("./core");
/**
 * Main function to do a Get request
 *
 * @param options GetRequestOptions
 * @returns
 */
async function get(options) {
    const response = await (0, core_1.aptosRequest)({ ...options, method: "GET" });
    return response;
}
exports.get = get;
//# sourceMappingURL=get.js.map