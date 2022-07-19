"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAUCET_URL = exports.NODE_URL = void 0;
exports.NODE_URL = process.env.APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com';
exports.FAUCET_URL = process.env.APTOS_FAUCET_URL || 'https://faucet.devnet.aptoslabs.com';
test('noop', () => {
    // All TS files are compiled by default into the npm package
    // Adding this empty test allows us to:
    // 1. Guarantee that this test library won't get compiled
    // 2. Prevent jest from exploding when it finds a file with no tests in it
});
//# sourceMappingURL=util.test.js.map