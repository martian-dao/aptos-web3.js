"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aptos_account_1 = require("../../account/aptos_account");
const bcs_1 = require("../../bcs");
const faucet_client_1 = require("../../plugins/faucet_client");
const indexer_1 = require("../../providers/indexer");
const token_client_1 = require("../../plugins/token_client");
const test_helper_test_1 = require("../unit/test_helper.test");
const utils_1 = require("../../utils");
const providers_1 = require("../../providers");
const plugins_1 = require("../../plugins");
const provider = new providers_1.Provider(utils_1.Network.DEVNET);
const aptosToken = new plugins_1.AptosToken(provider);
const faucetClient = new faucet_client_1.FaucetClient("https://fullnode.devnet.aptoslabs.com", "https://faucet.devnet.aptoslabs.com", {
    TOKEN: test_helper_test_1.FAUCET_AUTH_TOKEN,
});
const tokenClient = new token_client_1.TokenClient(provider.aptosClient);
const alice = new aptos_account_1.AptosAccount();
const collectionName = "AliceCollection";
const collectionNameV2 = "AliceCollection2";
const tokenName = "Alice Token";
const indexerClient = new indexer_1.IndexerClient(utils_1.NetworkToIndexerAPI[utils_1.Network.DEVNET]);
let skipTest = false;
let runTests = describe;
describe("Indexer", () => {
    it("should throw an error when account address is not valid", async () => {
        const address1 = "702ca08576f66393140967fef983bb6bf160dafeb73de9c4ddac4d2dc";
        expect(async () => {
            await indexerClient.getAccountNFTs(address1);
        }).rejects.toThrow(`${address1} is less than 66 chars long.`);
        const address2 = "0x702ca08576f66393140967fef983bb6bf160dafeb73de9c4ddac4d2dc";
        expect(async () => {
            await indexerClient.getAccountNFTs(address2);
        }).rejects.toThrow(`${address2} is less than 66 chars long.`);
    });
    it("should not throw an error when account address is missing 0x", async () => {
        const address = "790a34c702ca08576f66393140967fef983bb6bf160dafeb73de9c4ddac4d2dc";
        expect(async () => {
            await indexerClient.getAccountNFTs(address);
        }).not.toThrow();
    });
    beforeAll(async () => {
        const indexerLedgerInfo = await provider.getIndexerLedgerInfo();
        const fullNodeChainId = await provider.getChainId();
        console.log(`\n fullnode chain id is: ${fullNodeChainId}, indexer chain id is: ${indexerLedgerInfo.ledger_infos[0].chain_id}`);
        if (indexerLedgerInfo.ledger_infos[0].chain_id !== fullNodeChainId) {
            console.log(`\n fullnode chain id and indexer chain id are not synced, skipping rest of tests`);
            skipTest = true;
            runTests = describe.skip;
        }
        if (!skipTest) {
            await faucetClient.fundAccount(alice.address(), 100000000);
            // Create collection and token on Alice's account
            await provider.waitForTransaction(await tokenClient.createCollection(alice, collectionName, "Alice's simple collection", "https://aptos.dev"), { checkSuccess: true });
            await provider.waitForTransaction(await tokenClient.createTokenWithMutabilityConfig(alice, collectionName, tokenName, "Alice's simple token", 1, "https://aptos.dev/img/nyan.jpeg", 1000, alice.address(), 1, 0, ["TOKEN_BURNABLE_BY_OWNER"], [(0, bcs_1.bcsSerializeBool)(true)], ["bool"], [false, false, false, false, true]), { checkSuccess: true });
            await provider.waitForTransaction(await aptosToken.createCollection(alice, "Alice's simple collection", collectionNameV2, "https://aptos.dev", 5, {
                royaltyNumerator: 10,
                royaltyDenominator: 10,
            }), { checkSuccess: true });
            await provider.waitForTransactionWithResult(await aptosToken.mint(alice, collectionNameV2, "Alice's simple token", tokenName, "https://aptos.dev/img/nyan.jpeg", ["key"], ["bool"], ["true"]), { checkSuccess: true });
        }
    }, test_helper_test_1.longTestTimeout);
    runTests("get data", () => {
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
            expect(accountTransactionsCount.move_resources_aggregate.aggregate?.count).toEqual(5);
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
            expect(tokenData.current_token_datas_v2[0].token_name).toEqual("Alice Token");
        }, test_helper_test_1.longTestTimeout);
        it("gets token owners data", async () => {
            const accountNFTs = await indexerClient.getAccountNFTs(alice.address().hex());
            const tokenOwnersData = await indexerClient.getTokenOwnersData(accountNFTs.current_token_ownerships[0].current_token_data.token_data_id_hash, 0);
            expect(tokenOwnersData.current_token_ownerships_v2[0].owner_address).toEqual(alice.address().hex());
        }, test_helper_test_1.longTestTimeout);
        it("gets token current owner data", async () => {
            const accountNFTs = await indexerClient.getAccountNFTs(alice.address().hex());
            const tokenOwnersData = await indexerClient.getTokenCurrentOwnerData(accountNFTs.current_token_ownerships[0].current_token_data.token_data_id_hash, 0);
            expect(tokenOwnersData.current_token_ownerships_v2[0].owner_address).toEqual(alice.address().hex());
        }, test_helper_test_1.longTestTimeout);
        it("gets top user transactions", async () => {
            const topUserTransactions = await indexerClient.getTopUserTransactions(5);
            expect(topUserTransactions.user_transactions.length).toEqual(5);
        }, test_helper_test_1.longTestTimeout);
        it("gets user transactions", async () => {
            const userTransactions = await indexerClient.getUserTransactions(482294669, { limit: 4 });
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
        it("gets account current tokens", async () => {
            const tokens = await indexerClient.getOwnedTokens(alice.address().hex());
            expect(tokens.current_token_ownerships_v2).toHaveLength(2);
        });
        it("gets account current tokens from a specified token standard", async () => {
            const tokens = await indexerClient.getOwnedTokens(alice.address().hex(), { tokenStandard: "v2" });
            expect(tokens.current_token_ownerships_v2).toHaveLength(1);
        });
        it("gets the collection data", async () => {
            const collectionData = await indexerClient.getCollectionData(alice.address().hex(), collectionName);
            expect(collectionData.current_collections_v2).toHaveLength(1);
            expect(collectionData.current_collections_v2[0].collection_name).toEqual(collectionName);
        });
        it("gets the currect collection address", async () => {
            const collectionData = await indexerClient.getCollectionData(alice.address().hex(), collectionNameV2);
            const collectionAddress = await indexerClient.getCollectionAddress(alice.address().hex(), collectionNameV2);
            expect(collectionData.current_collections_v2[0].collection_id).toEqual(collectionAddress);
        });
        it("gets account current tokens of a specific collection by the collection address with token standard specified", async () => {
            const tokens = await indexerClient.getTokenOwnedFromCollectionNameAndCreatorAddress(alice.address().hex(), collectionNameV2, alice.address().hex(), {
                tokenStandard: "v2",
            });
            expect(tokens.current_token_ownerships_v2).toHaveLength(1);
            expect(tokens.current_token_ownerships_v2[0].token_standard).toEqual("v2");
        }, test_helper_test_1.longTestTimeout);
        it("returns same result for getTokenOwnedFromCollectionNameAndCreatorAddress and getTokenOwnedFromCollectionAddress", async () => {
            const collectionAddress = await indexerClient.getCollectionAddress(alice.address().hex(), collectionNameV2);
            const tokensFromCollectionAddress = await indexerClient.getTokenOwnedFromCollectionAddress(alice.address().hex(), collectionAddress);
            const tokensFromNameAndCreatorAddress = await indexerClient.getTokenOwnedFromCollectionNameAndCreatorAddress(alice.address().hex(), collectionNameV2, alice.address().hex());
            expect(tokensFromCollectionAddress.current_token_ownerships_v2).toEqual(tokensFromNameAndCreatorAddress.current_token_ownerships_v2);
        }, test_helper_test_1.longTestTimeout);
        it("queries for all collections that an account has tokens for", async () => {
            const collections = await indexerClient.getCollectionsWithOwnedTokens(alice.address().hex());
            expect(collections.current_collection_ownership_v2_view.length).toEqual(2);
        }, test_helper_test_1.longTestTimeout);
        it("queries for all v2 collections that an account has tokens for", async () => {
            const collections = await indexerClient.getCollectionsWithOwnedTokens(alice.address().hex(), {
                tokenStandard: "v2",
            });
            expect(collections.current_collection_ownership_v2_view.length).toEqual(1);
        }, test_helper_test_1.longTestTimeout);
    });
});
//# sourceMappingURL=indexer.test.js.map