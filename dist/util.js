"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToUtf8 = exports.sleep = void 0;
async function sleep(timeMs) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeMs);
    });
}
exports.sleep = sleep;
function hexToUtf8(s) {
    try {
        return decodeURIComponent(s.replace(/\s+/g, '') // remove spaces
            .replace(/[0-9a-f]{2}/g, '%$&') // add '%' before each 2 characters
        );
    }
    catch (err) {
        return s;
    }
}
exports.hexToUtf8 = hexToUtf8;
//# sourceMappingURL=util.js.map