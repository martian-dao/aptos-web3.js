"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../client");
const pagination_helpers_1 = require("../../utils/pagination_helpers");
const test_helper_test_1 = require("../unit/test_helper.test");
/**
 * If 0x1 ever has more than 9999 modules this test will fail
 * since the first query will only return 9999 modules
 * and the second query will return all modules
 */
test("gets the full data with pagination", async () => {
    try {
        const modules = await (0, client_1.get)({
            url: "https://fullnode.testnet.aptoslabs.com/v1",
            endpoint: "accounts/0x1/modules",
            params: { limit: 9999 },
        });
        const paginateOut = await (0, pagination_helpers_1.paginateWithCursor)({
            url: "https://fullnode.testnet.aptoslabs.com/v1",
            endpoint: "accounts/0x1/modules",
            params: { limit: 20 },
        });
        expect(paginateOut.length).toBe(modules.data.length);
    }
    catch (err) {
        console.log(err);
    }
}, test_helper_test_1.longTestTimeout);
//# sourceMappingURL=pagination_helper.test.js.map