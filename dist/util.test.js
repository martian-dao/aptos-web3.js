"use strict";
// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAUCET_URL = exports.NODE_URL = void 0;
const aptos_client_1 = require("./aptos_client");
exports.NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
exports.FAUCET_URL = process.env.APTOS_FAUCET_URL || "https://faucet.devnet.aptoslabs.com";
test("noop", () => {
    // All TS files are compiled by default into the npm package
    // Adding this empty test allows us to:
    // 1. Guarantee that this test library won't get compiled
    // 2. Prevent jest from exploding when it finds a file with no tests in it
});
test("test fixNodeUrl", () => {
    expect(new aptos_client_1.AptosClient("https://test.com").client.request.config.BASE).toBe("https://test.com/v1");
    expect(new aptos_client_1.AptosClient("https://test.com/").client.request.config.BASE).toBe("https://test.com/v1");
    expect(new aptos_client_1.AptosClient("https://test.com/v1").client.request.config.BASE).toBe("https://test.com/v1");
    expect(new aptos_client_1.AptosClient("https://test.com/v1/").client.request.config.BASE).toBe("https://test.com/v1");
    expect(new aptos_client_1.AptosClient("https://test.com", {}, true).client.request.config.BASE).toBe("https://test.com");
});
//# sourceMappingURL=util.test.js.map