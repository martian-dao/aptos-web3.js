"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aptos_account_1 = require("../../account/aptos_account");
const aptos_client_1 = require("../../providers/aptos_client");
const bcs_1 = require("../../bcs");
const faucet_client_1 = require("../../plugins/faucet_client");
const indexer_1 = require("../../providers/indexer");
const token_client_1 = require("../../plugins/token_client");
const test_helper_test_1 = require("../unit/test_helper.test");
const utils_1 = require("../../utils");
const aptosClient = new aptos_client_1.AptosClient(utils_1.NetworkToNodeAPI[utils_1.Network.TESTNET]);
const faucetClient = new faucet_client_1.FaucetClient("https://fullnode.testnet.aptoslabs.com", "https://faucet.testnet.aptoslabs.com", { TOKEN: test_helper_test_1.FAUCET_AUTH_TOKEN });
const tokenClient = new token_client_1.TokenClient(aptosClient);
const alice = new aptos_account_1.AptosAccount();
const collectionName = "AliceCollection";
const tokenName = "Alice Token";
const indexerClient = new indexer_1.IndexerClient(utils_1.NetworkToIndexerAPI[utils_1.Network.TESTNET]);
describe("Indexer", () => {
    it("should throw an error when account address is not valid", async () => {
        expect(async () => {
            await indexerClient.getAccountNFTs("702ca08576f66393140967fef983bb6bf160dafeb73de9c4ddac4d2dc");
        }).rejects.toThrow("Address needs to be 66 chars long.");
        expect(async () => {
            await indexerClient.getAccountNFTs("0x702ca08576f66393140967fef983bb6bf160dafeb73de9c4ddac4d2dc");
        }).rejects.toThrow("Address needs to be 66 chars long.");
    });
    it("should not throw an error when account address is missing 0x", async () => {
        expect(async () => {
            await indexerClient.getAccountNFTs("790a34c702ca08576f66393140967fef983bb6bf160dafeb73de9c4ddac4d2dc");
        }).not.toThrow("Address needs to be 66 chars long.");
    });
    beforeAll(async () => {
        await faucetClient.fundAccount(alice.address(), 100000000);
        // Create collection and token on Alice's account
        await aptosClient.waitForTransaction(await tokenClient.createCollection(alice, collectionName, "Alice's simple collection", "https://aptos.dev"), { checkSuccess: true });
        await aptosClient.waitForTransaction(await tokenClient.createTokenWithMutabilityConfig(alice, collectionName, tokenName, "Alice's simple token", 1, "https://aptos.dev/img/nyan.jpeg", 1000, alice.address(), 1, 0, ["TOKEN_BURNABLE_BY_OWNER"], [(0, bcs_1.bcsSerializeBool)(true)], ["bool"], [false, false, false, false, true]), { checkSuccess: true });
    }, test_helper_test_1.longTestTimeout);
    describe("get data", () => {
        jest.retryTimes(5);
        beforeEach(async () => {
            await (0, utils_1.sleep)(1000);
        });
        it("gets account NFTs", async () => {
            const accountNFTs = await indexerClient.getAccountNFTs(alice.address().hex());
            expect(accountNFTs.current_token_ownerships).toHaveLength(1);
            expect(accountNFTs.current_token_ownerships[0]).toHaveProperty("current_token_data");
            expect(accountNFTs.current_token_ownerships[0]).toHaveProperty("current_collection_data");
            expect(accountNFTs.current_token_ownerships[0].current_token_data?.name).toBe("Alice Token");
        }, test_helper_test_1.longTestTimeout);
        it("gets token activities", async () => {
            const accountNFTs = await indexerClient.getAccountNFTs(alice.address().hex());
            const tokenActivity = await indexerClient.getTokenActivities(accountNFTs.current_token_ownerships[0].current_token_data.token_data_id_hash);
            expect(tokenActivity.token_activities).toHaveLength(2);
            expect(tokenActivity.token_activities[0]).toHaveProperty("from_address");
            expect(tokenActivity.token_activities[0]).toHaveProperty("to_address");
        }, test_helper_test_1.longTestTimeout);
        it("gets account coin data", async () => {
            const accountCoinData = await indexerClient.getAccountCoinsData(alice.address().hex());
            expect(accountCoinData.current_coin_balances[0].coin_type).toEqual("0x1::aptos_coin::AptosCoin");
        }, test_helper_test_1.longTestTimeout);
        it("gets account token count", async () => {
            const accountTokenCount = await indexerClient.getAccountTokensCount(alice.address().hex());
            expect(accountTokenCount.current_token_ownerships_aggregate.aggregate?.count).toEqual(1);
        }, test_helper_test_1.longTestTimeout);
        it("gets account transactions count", async () => {
            const accountTransactionsCount = await indexerClient.getAccountTransactionsCount(alice.address().hex());
            expect(accountTransactionsCount.move_resources_aggregate.aggregate?.count).toEqual(3);
        }, test_helper_test_1.longTestTimeout);
        it("gets account transactions data", async () => {
            const accountTransactionsData = await indexerClient.getAccountTransactionsData(alice.address().hex());
            expect(accountTransactionsData.move_resources[0]).toHaveProperty("transaction_version");
        }, test_helper_test_1.longTestTimeout);
        it("gets token activities count", async () => {
            const accountNFTs = await indexerClient.getAccountNFTs(alice.address().hex());
            const tokenActivitiesCount = await indexerClient.getTokenActivitiesCount(accountNFTs.current_token_ownerships[0].current_token_data.token_data_id_hash);
            expect(tokenActivitiesCount.token_activities_aggregate.aggregate?.count).toBe(2);
        }, test_helper_test_1.longTestTimeout);
        it("gets token data", async () => {
            const accountNFTs = await indexerClient.getAccountNFTs(alice.address().hex());
            const tokenData = await indexerClient.getTokenData(accountNFTs.current_token_ownerships[0].current_token_data.token_data_id_hash);
            expect(tokenData.current_token_datas[0].name).toEqual("Alice Token");
        }, test_helper_test_1.longTestTimeout);
        it("gets token owners data", async () => {
            const accountNFTs = await indexerClient.getAccountNFTs(alice.address().hex());
            const tokenOwnersData = await indexerClient.getTokenOwnersData(accountNFTs.current_token_ownerships[0].current_token_data.token_data_id_hash, 0);
            expect(tokenOwnersData.current_token_ownerships[0].owner_address).toEqual(alice.address().hex());
        }, test_helper_test_1.longTestTimeout);
        it("gets top user transactions", async () => {
            const topUserTransactions = await indexerClient.getTopUserTransactions(5);
            expect(topUserTransactions.user_transactions.length).toEqual(5);
        }, test_helper_test_1.longTestTimeout);
        it("gets user transactions", async () => {
            const userTransactions = await indexerClient.getUserTransactions(482294669, { limit: 4 });
            expect(userTransactions.user_transactions[0].version).toEqual(482294669);
            expect(userTransactions.user_transactions.length).toEqual(4);
        }, test_helper_test_1.longTestTimeout);
        it("gets number of delegators", async () => {
            const numberOfDelegators = await indexerClient.getNumberOfDelegators(alice.address().hex());
            expect(numberOfDelegators.num_active_delegator_per_pool).toHaveLength(0);
        }, test_helper_test_1.longTestTimeout);
        it("gets indexer ledger info", async () => {
            const ledgerInfo = await indexerClient.getIndexerLedgerInfo();
            expect(ledgerInfo.ledger_infos[0].chain_id).toBeGreaterThan(1);
        });
    });
});
//# sourceMappingURL=indexer.test.js.map