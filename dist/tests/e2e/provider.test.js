"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("../../providers/provider");
const utils_1 = require("../../utils");
describe("Provider", () => {
    it("uses provided network as API", async () => {
        const provider = new provider_1.Provider(utils_1.Network.DEVNET);
        expect(provider.aptosClient.nodeUrl).toBe(utils_1.NetworkToNodeAPI[utils_1.Network.DEVNET]);
        expect(provider.indexerClient.endpoint).toBe(utils_1.NetworkToIndexerAPI[utils_1.Network.DEVNET]);
    });
    it("uses custom endpoints as API", async () => {
        const provider = new provider_1.Provider({ fullnodeUrl: "full-node-url", indexerUrl: "indexer-url" });
        expect(provider.aptosClient.nodeUrl).toBe("full-node-url/v1");
        expect(provider.indexerClient.endpoint).toBe("indexer-url");
    });
    it("includes static methods", async () => {
        expect(provider_1.Provider).toHaveProperty("generateBCSTransaction");
        expect(provider_1.Provider).toHaveProperty("generateBCSSimulation");
    });
    it("throws error when endpoint not provided", async () => {
        expect(() => {
            new provider_1.Provider({ fullnodeUrl: "", indexerUrl: "" });
        }).toThrow("network is not provided");
    });
    it("has AptosClient method defined", () => {
        const provider = new provider_1.Provider(utils_1.Network.DEVNET);
        expect(provider.getAccount).toBeDefined();
    });
    it("has IndexerClient method defined", () => {
        const provider = new provider_1.Provider(utils_1.Network.DEVNET);
        expect(provider.getAccountNFTs).toBeDefined();
    });
});
//# sourceMappingURL=provider.test.js.map