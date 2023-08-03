"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const aptos_client_1 = require("../../providers/aptos_client");
test("test fixNodeUrl", () => {
    expect(new aptos_client_1.AptosClient("https://test.com").nodeUrl).toBe("https://test.com/v1");
    expect(new aptos_client_1.AptosClient("https://test.com/").nodeUrl).toBe("https://test.com/v1");
    expect(new aptos_client_1.AptosClient("https://test.com/v1").nodeUrl).toBe("https://test.com/v1");
    expect(new aptos_client_1.AptosClient("https://test.com/v1/").nodeUrl).toBe("https://test.com/v1");
    expect(new aptos_client_1.AptosClient("https://test.com", {}, true).nodeUrl).toBe("https://test.com");
});
//# sourceMappingURL=misc.test.js.map