"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.CUSTOM_REQUEST_HEADER = exports.APTOS_COIN = exports.DEFAULT_TXN_TIMEOUT_SEC = exports.DEFAULT_TXN_EXP_SEC_FROM_NOW = exports.DEFAULT_MAX_GAS_AMOUNT = exports.fixNodeUrl = exports.DEFAULT_VERSION_PATH_BASE = exports.sleep = void 0;
const version_1 = require("../version");
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
exports.DEFAULT_MAX_GAS_AMOUNT = 20000;
// Transaction expire timestamp
exports.DEFAULT_TXN_EXP_SEC_FROM_NOW = 60;
// How long does SDK wait for txhn to finish
exports.DEFAULT_TXN_TIMEOUT_SEC = 60;
exports.APTOS_COIN = "0x1::aptos_coin::AptosCoin";
exports.CUSTOM_REQUEST_HEADER = { "x-aptos-client": `aptos-ts-sdk/${version_1.VERSION}` };
//# sourceMappingURL=misc.js.map