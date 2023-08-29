"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = void 0;
const core_1 = require("./core");
/**
 * Main function to do a Post request
 *
 * @param options PostRequestOptions
 * @returns
 */
async function post(options) {
    const response = await (0, core_1.aptosRequest)({ ...options, method: "POST" });
    return response;
}
exports.post = post;
//# sourceMappingURL=post.js.map