"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aptos_account_1 = require("../../account/aptos_account");
const aptos_client_1 = require("../../providers/aptos_client");
const bcs_1 = require("../../bcs");
const provider_1 = require("../../providers/provider");
const faucet_client_1 = require("../../plugins/faucet_client");
const token_client_1 = require("../../plugins/token_client");
const utils_1 = require("../../utils");
const test_helper_test_1 = require("../unit/test_helper.test");
describe("Provider", () => {
    const faucetClient = new faucet_client_1.FaucetClient("https://fullnode.testnet.aptoslabs.com", "https://faucet.testnet.aptoslabs.com", { TOKEN: test_helper_test_1.FAUCET_AUTH_TOKEN });
    const alice = new aptos_account_1.AptosAccount();
    it("uses provided network as API", async () => {
        const provider = new provider_1.Provider(utils_1.Network.TESTNET);
        expect(provider.aptosClient.nodeUrl).toBe(utils_1.NetworkToNodeAPI[utils_1.Network.TESTNET]);
        expect(provider.indexerClient.endpoint).toBe(utils_1.NetworkToIndexerAPI[utils_1.Network.TESTNET]);
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
    describe("requests", () => {
        beforeAll(async () => {
            await faucetClient.fundAccount(alice.address(), 100000000);
        });
        describe("query full node", () => {
            it("gets genesis account from fullnode", async () => {
                const provider = new provider_1.Provider(utils_1.Network.TESTNET);
                const genesisAccount = await provider.getAccount("0x1");
                expect(genesisAccount.authentication_key.length).toBe(66);
                expect(genesisAccount.sequence_number).not.toBeNull();
            });
        });
        describe("query indexer", () => {
            const aptosClient = new aptos_client_1.AptosClient("https://fullnode.testnet.aptoslabs.com");
            const tokenClient = new token_client_1.TokenClient(aptosClient);
            const collectionName = "AliceCollection";
            const tokenName = "Alice Token";
            beforeAll(async () => {
                // Create collection and token on Alice's account
                await aptosClient.waitForTransaction(await tokenClient.createCollection(alice, collectionName, "Alice's simple collection", "https://aptos.dev"), { checkSuccess: true });
                await aptosClient.waitForTransaction(await tokenClient.createTokenWithMutabilityConfig(alice, collectionName, tokenName, "Alice's simple token", 1, "https://aptos.dev/img/nyan.jpeg", 1000, alice.address(), 1, 0, ["TOKEN_BURNABLE_BY_OWNER"], [(0, bcs_1.bcsSerializeBool)(true)], ["bool"], [false, false, false, false, true]), { checkSuccess: true });
            }, test_helper_test_1.longTestTimeout);
            jest.retryTimes(5);
            beforeEach(async () => {
                await (0, utils_1.sleep)(1000);
            });
            it("gets account NFTs from indexer", async () => {
                let provider = new provider_1.Provider(utils_1.Network.TESTNET);
                const accountNFTs = await provider.getAccountNFTs(alice.address().hex(), { limit: 20, offset: 0 });
                expect(accountNFTs.current_token_ownerships).toHaveLength(1);
                expect(accountNFTs.current_token_ownerships[0]).toHaveProperty("current_token_data");
                expect(accountNFTs.current_token_ownerships[0]).toHaveProperty("current_collection_data");
                expect(accountNFTs.current_token_ownerships[0].current_token_data?.name).toBe("Alice Token");
            });
        });
    });
});
//# sourceMappingURL=provider.test.js.map