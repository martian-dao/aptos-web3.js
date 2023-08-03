"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = exports.NodeAPIToNetwork = exports.NetworkToNodeAPI = exports.NetworkToIndexerAPI = void 0;
exports.NetworkToIndexerAPI = {
    mainnet: "https://indexer.mainnet.aptoslabs.com/v1/graphql",
    testnet: "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql",
    devnet: "https://indexer-devnet.staging.gcp.aptosdev.com/v1/graphql",
};
exports.NetworkToNodeAPI = {
    mainnet: "https://fullnode.mainnet.aptoslabs.com/v1",
    testnet: "https://fullnode.testnet.aptoslabs.com/v1",
    devnet: "https://fullnode.devnet.aptoslabs.com/v1",
};
exports.NodeAPIToNetwork = {
    "https://fullnode.mainnet.aptoslabs.com/v1": "mainnet",
    "https://fullnode.testnet.aptoslabs.com/v1": "testnet",
    "https://fullnode.devnet.aptoslabs.com/v1": "devnet",
};
var Network;
(function (Network) {
    Network["MAINNET"] = "mainnet";
    Network["TESTNET"] = "testnet";
    Network["DEVNET"] = "devnet";
})(Network = exports.Network || (exports.Network = {}));
//# sourceMappingURL=api-endpoints.js.map