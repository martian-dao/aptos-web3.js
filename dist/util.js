"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
async function sleep(timeMs) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeMs);
    });
}
exports.sleep = sleep;
//# sourceMappingURL=util.js.map