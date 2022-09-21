"use strict";
// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixNodeUrl = exports.DEFAULT_VERSION_PATH_BASE = exports.sleep = void 0;
async function sleep(timeMs) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeMs);
    });
}
exports.sleep = sleep;
exports.DEFAULT_VERSION_PATH_BASE = "/v1";
function fixNodeUrl(nodeUrl) {
    let out = `${nodeUrl}`;
    if (out.endsWith("/")) {
        out = out.substring(0, out.length - 1);
    }
    if (!out.endsWith(exports.DEFAULT_VERSION_PATH_BASE)) {
        out = `${out}${exports.DEFAULT_VERSION_PATH_BASE}`;
    }
    return out;
}
exports.fixNodeUrl = fixNodeUrl;
//# sourceMappingURL=util.js.map