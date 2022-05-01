"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const faucet_client_1 = require("./faucet_client");
const aptos_account_1 = require("./aptos_account");
const aptos_client_1 = require("./aptos_client");
const token_client_1 = require("./token_client");
const util_test_1 = require("./util.test");
test("full tutorial nft token flow", () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const faucetClient = new faucet_client_1.FaucetClient(util_test_1.NODE_URL, util_test_1.FAUCET_URL);
    const tokenClient = new token_client_1.TokenClient(client);
    const alice = new aptos_account_1.AptosAccount();
    const bob = new aptos_account_1.AptosAccount();
    // Fund both Alice's and Bob's Account
    yield faucetClient.fundAccount(alice.address(), 10000);
    yield faucetClient.fundAccount(bob.address(), 5000);
    // Create collection and token on Alice's account
    yield tokenClient.createCollection(alice, "Alice's simple collection", "AliceCollection", "https://aptos.dev");
    let resources = yield client.getAccountResources(alice.address().toString());
    let accountResource = resources.find((r) => r.type === "0x1::Token::Collections");
    let collection = yield tokenClient.tableItem(accountResource.data.collections.handle, "0x1::ASCII::String", "0x1::Token::Collection", "AliceCollection");
    expect(collection['name']).toBe("AliceCollection");
    yield tokenClient.createToken(alice, "AliceCollection", "Alice's simple token", "AliceToken", 1, "https://aptos.dev/img/nyan.jpeg");
    let tokenData = yield tokenClient.tableItem(collection["tokens"]["handle"], "0x1::ASCII::String", "0x1::Token::TokenData", "AliceToken");
    expect(tokenData['name']).toBe("AliceToken");
    // Transfer Token from Alice's Account to Bob's Account
    const token_id = yield tokenClient.getTokenId(alice.address().hex(), "AliceCollection", "AliceToken");
    yield tokenClient.offerToken(alice, bob.address().hex(), alice.address().hex(), token_id, 1);
    yield tokenClient.claimToken(bob, alice.address().hex(), alice.address().hex(), token_id);
    resources = yield client.getAccountResources(bob.address().toString());
    accountResource = resources.find((r) => r.type === "0x1::Token::Gallery");
    let token = yield tokenClient.tableItem(accountResource.data.gallery.handle, "0x1::GUID::ID", "0x1::Token::Token", {
        "addr": alice.address().toString(),
        "creation_num": `${token_id}`
    });
    expect(token['name']).toBe("AliceToken");
}), 30 * 1000);
//# sourceMappingURL=token_client.test.js.map