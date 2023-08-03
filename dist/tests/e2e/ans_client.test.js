"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = require("../../account");
const aptos_types_1 = require("../../aptos_types");
const ans_client_1 = require("../../plugins/ans_client");
const providers_1 = require("../../providers");
const utils_1 = require("../../utils");
const test_helper_test_1 = require("../unit/test_helper.test");
const alice = new account_1.AptosAccount();
const ACCOUNT_ADDRESS = aptos_types_1.AccountAddress.standardizeAddress(alice.address().hex());
// generate random name so we can run the test against local tesnet without the need to re-run it each time.
// This will produce a string anywhere between zero and 12 characters long, usually 11 characters, only lower-case and numbers
const DOMAIN_NAME = Math.random().toString(36).slice(2);
const SUBDOMAIN_NAME = Math.random().toString(36).slice(2);
describe("ANS", () => {
    beforeAll(async () => {
        const faucetClient = (0, test_helper_test_1.getFaucetClient)();
        await faucetClient.fundAccount(alice.address(), 100000000000);
    }, test_helper_test_1.longTestTimeout);
    test("fails to create a new ANS class instance", () => {
        const provider = new providers_1.Provider({ fullnodeUrl: "full-node-url", indexerUrl: "indexer-url" });
        expect(() => new ans_client_1.AnsClient(provider)).toThrow("Error: For custom providers, you must pass in a contract address");
    });
    test("creates a new ANS class instance", () => {
        const provider = new providers_1.Provider({ fullnodeUrl: "full-node-url", indexerUrl: "indexer-url" });
        const ans_client = new ans_client_1.AnsClient(provider, test_helper_test_1.ANS_OWNER_ADDRESS);
        expect(ans_client).toHaveProperty("contractAddress");
    });
    test("sets the contract address to be the provided one", () => {
        const provider = new providers_1.Provider({ fullnodeUrl: "full-node-url", indexerUrl: "indexer-url" });
        const ans_client = new ans_client_1.AnsClient(provider, test_helper_test_1.ANS_OWNER_ADDRESS);
        expect(ans_client.contractAddress).toEqual(test_helper_test_1.ANS_OWNER_ADDRESS);
    });
    test("sets the contract address to be the one that matches the provided node url", () => {
        const provider = new providers_1.Provider(utils_1.Network.TESTNET);
        const ans_client = new ans_client_1.AnsClient(provider, test_helper_test_1.ANS_OWNER_ADDRESS);
        expect(ans_client.contractAddress).toEqual("0x5f8fd2347449685cf41d4db97926ec3a096eaf381332be4f1318ad4d16a8497c");
    });
    test("init reverse lookup registry for contract admin", async () => {
        const owner = new account_1.AptosAccount(new utils_1.HexString(test_helper_test_1.ANS_OWNER_PK).toUint8Array());
        const provider = new providers_1.Provider({ fullnodeUrl: test_helper_test_1.NODE_URL, indexerUrl: test_helper_test_1.NODE_URL });
        const ans_client = new ans_client_1.AnsClient(provider, test_helper_test_1.ANS_OWNER_ADDRESS);
        const txnHash = await ans_client.initReverseLookupRegistry(owner);
        await provider.waitForTransactionWithResult(txnHash, { checkSuccess: true });
    }, test_helper_test_1.longTestTimeout);
    test("mint name", async () => {
        const provider = new providers_1.Provider({ fullnodeUrl: test_helper_test_1.NODE_URL, indexerUrl: test_helper_test_1.NODE_URL });
        const ans = new ans_client_1.AnsClient(provider, test_helper_test_1.ANS_OWNER_ADDRESS);
        const txnHash = await ans.mintAptosName(alice, DOMAIN_NAME);
        await provider.waitForTransactionWithResult(txnHash, { checkSuccess: true });
    }, test_helper_test_1.longTestTimeout);
    test("mint subdomain name", async () => {
        const provider = new providers_1.Provider({ fullnodeUrl: test_helper_test_1.NODE_URL, indexerUrl: test_helper_test_1.NODE_URL });
        const ans = new ans_client_1.AnsClient(provider, test_helper_test_1.ANS_OWNER_ADDRESS);
        const txnHash = await ans.mintAptosSubdomain(alice, SUBDOMAIN_NAME, DOMAIN_NAME);
        await provider.waitForTransactionWithResult(txnHash, { checkSuccess: true });
        const txnHashForSet = await ans.setSubdomainAddress(alice, SUBDOMAIN_NAME, DOMAIN_NAME, ACCOUNT_ADDRESS);
        await provider.waitForTransactionWithResult(txnHashForSet, { checkSuccess: true });
    }, test_helper_test_1.longTestTimeout);
    test("get name by address", async () => {
        const provider = new providers_1.Provider({ fullnodeUrl: test_helper_test_1.NODE_URL, indexerUrl: test_helper_test_1.NODE_URL });
        const ans = new ans_client_1.AnsClient(provider, test_helper_test_1.ANS_OWNER_ADDRESS);
        const name = await ans.getPrimaryNameByAddress(ACCOUNT_ADDRESS);
        expect(name).toEqual(DOMAIN_NAME);
    }, test_helper_test_1.longTestTimeout);
    test("get address by name", async () => {
        const provider = new providers_1.Provider({ fullnodeUrl: test_helper_test_1.NODE_URL, indexerUrl: test_helper_test_1.NODE_URL });
        const ans = new ans_client_1.AnsClient(provider, test_helper_test_1.ANS_OWNER_ADDRESS);
        const address = await ans.getAddressByName(DOMAIN_NAME);
        const standardizeAddress = aptos_types_1.AccountAddress.standardizeAddress(address);
        expect(standardizeAddress).toEqual(ACCOUNT_ADDRESS);
    }, test_helper_test_1.longTestTimeout);
    test("get address by name with .apt", async () => {
        const provider = new providers_1.Provider({ fullnodeUrl: test_helper_test_1.NODE_URL, indexerUrl: test_helper_test_1.NODE_URL });
        const ans = new ans_client_1.AnsClient(provider, test_helper_test_1.ANS_OWNER_ADDRESS);
        const address = await ans.getAddressByName(`${DOMAIN_NAME}.apt`);
        const standardizeAddress = aptos_types_1.AccountAddress.standardizeAddress(address);
        expect(standardizeAddress).toEqual(ACCOUNT_ADDRESS);
    }, test_helper_test_1.longTestTimeout);
    test("get address by subdomain_name", async () => {
        const provider = new providers_1.Provider({ fullnodeUrl: test_helper_test_1.NODE_URL, indexerUrl: test_helper_test_1.NODE_URL });
        const ans = new ans_client_1.AnsClient(provider, test_helper_test_1.ANS_OWNER_ADDRESS);
        const address = await ans.getAddressByName(`${SUBDOMAIN_NAME}.${DOMAIN_NAME}`);
        const standardizeAddress = aptos_types_1.AccountAddress.standardizeAddress(address);
        expect(standardizeAddress).toEqual(ACCOUNT_ADDRESS);
    }, test_helper_test_1.longTestTimeout);
    test("get address by subdomain_name with .apt", async () => {
        const provider = new providers_1.Provider({ fullnodeUrl: test_helper_test_1.NODE_URL, indexerUrl: test_helper_test_1.NODE_URL });
        const ans = new ans_client_1.AnsClient(provider, test_helper_test_1.ANS_OWNER_ADDRESS);
        const address = await ans.getAddressByName(`${SUBDOMAIN_NAME}.${DOMAIN_NAME}.apt`);
        const standardizeAddress = aptos_types_1.AccountAddress.standardizeAddress(address);
        expect(standardizeAddress).toEqual(ACCOUNT_ADDRESS);
    }, test_helper_test_1.longTestTimeout);
    test("returns null for an invalid domain", async () => {
        const provider = new providers_1.Provider({ fullnodeUrl: test_helper_test_1.NODE_URL, indexerUrl: test_helper_test_1.NODE_URL });
        const ans = new ans_client_1.AnsClient(provider, test_helper_test_1.ANS_OWNER_ADDRESS);
        const address = await ans.getAddressByName(`${DOMAIN_NAME}-`);
        expect(address).toBeNull;
    }, test_helper_test_1.longTestTimeout);
    test("returns null for an invalid subdomain", async () => {
        const provider = new providers_1.Provider({ fullnodeUrl: test_helper_test_1.NODE_URL, indexerUrl: test_helper_test_1.NODE_URL });
        const ans = new ans_client_1.AnsClient(provider, test_helper_test_1.ANS_OWNER_ADDRESS);
        const address = await ans.getAddressByName(`${SUBDOMAIN_NAME}.${DOMAIN_NAME}.apt-`);
        expect(address).toBeNull;
    }, test_helper_test_1.longTestTimeout);
});
//# sourceMappingURL=ans_client.test.js.map