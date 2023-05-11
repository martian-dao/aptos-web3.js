"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.longTestTimeout = exports.getFaucetClient = exports.ANS_OWNER_PK = exports.ANS_OWNER_ADDRESS = exports.PROVIDER_LOCAL_NETWORK_CONFIG = exports.FAUCET_AUTH_TOKEN = exports.API_TOKEN = exports.FAUCET_URL = exports.NODE_URL = void 0;
const faucet_client_1 = require("../../plugins/faucet_client");
exports.NODE_URL = process.env.APTOS_NODE_URL;
exports.FAUCET_URL = process.env.APTOS_FAUCET_URL;
exports.API_TOKEN = process.env.API_TOKEN;
exports.FAUCET_AUTH_TOKEN = process.env.FAUCET_AUTH_TOKEN;
exports.PROVIDER_LOCAL_NETWORK_CONFIG = { fullnodeUrl: exports.NODE_URL, indexerUrl: exports.NODE_URL };
// account to use for ANS tests, this account matches the one in sdk-release.yaml
exports.ANS_OWNER_ADDRESS = "0x585fc9f0f0c54183b039ffc770ca282ebd87307916c215a3e692f2f8e4305e82";
exports.ANS_OWNER_PK = "0x37368b46ce665362562c6d1d4ec01a08c8644c488690df5a17e13ba163e20221";
/**
 * Returns an instance of a FaucetClient with NODE_URL and FAUCET_URL from the
 * environment. If the FAUCET_AUTH_TOKEN environment variable is set, it will
 * pass that along in the header in the format the faucet expects.
 */
function getFaucetClient() {
    const config = {};
    if (process.env.FAUCET_AUTH_TOKEN) {
        config.HEADERS = { Authorization: `Bearer ${process.env.FAUCET_AUTH_TOKEN}` };
    }
    return new faucet_client_1.FaucetClient(exports.NODE_URL, exports.FAUCET_URL, config);
}
exports.getFaucetClient = getFaucetClient;
test("noop", () => {
    // All TS files are compiled by default into the npm package
    // Adding this empty test allows us to:
    // 1. Guarantee that this test library won't get compiled
    // 2. Prevent jest from exploding when it finds a file with no tests in it
});
exports.longTestTimeout = 120 * 1000;
//# sourceMappingURL=test_helper.test.js.map