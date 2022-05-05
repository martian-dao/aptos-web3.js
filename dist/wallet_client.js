"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletClient = exports.RestClient = void 0;
const aptos_account_1 = require("./aptos_account");
const token_client_1 = require("./token_client");
const aptos_client_1 = require("./aptos_client");
const faucet_client_1 = require("./faucet_client");
const hex_string_1 = require("./hex_string");
const bip39 = __importStar(require("@scure/bip39"));
const english = __importStar(require("@scure/bip39/wordlists/english"));
const cross_fetch_1 = __importDefault(require("cross-fetch"));
/** A wrapper around the Aptos-core Rest API */
class RestClient {
    constructor(url) {
        this.client = new aptos_client_1.AptosClient(url);
    }
    accountSentEvents(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.getEventsByEventHandle(accountAddress, "0x1::TestCoin::TransferEvents", "sent_events");
        });
    }
    accountReceivedEvents(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.getEventsByEventHandle(accountAddress, "0x1::TestCoin::TransferEvents", "received_events");
        });
    }
    transactionPending(txnHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.transactionPending(txnHash);
        });
    }
    /** Waits up to 10 seconds for a transaction to move past pending state */
    waitForTransaction(txnHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.waitForTransaction(txnHash);
        });
    }
    /** Returns the test coin balance associated with the account */
    accountBalance(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const resources = yield this.client.getAccountResources(accountAddress);
            for (const key in resources) {
                const resource = resources[key];
                if (resource["type"] == "0x1::TestCoin::Balance") {
                    return parseInt(resource["data"]["coin"]["value"]);
                }
            }
            return null;
        });
    }
    /** Transfer a given coin amount from a given Account to the recipient's account address.
     Returns the sequence number of the transaction used to transfer. */
    transfer(accountFrom, recipient, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "script_function_payload",
                function: "0x1::TestCoin::transfer",
                type_arguments: [],
                arguments: [
                    `${hex_string_1.HexString.ensure(recipient)}`,
                    amount.toString(),
                ]
            };
            const txnRequest = yield this.client.generateTransaction(accountFrom.address(), payload);
            const signedTxn = yield this.client.signTransaction(accountFrom, txnRequest);
            const res = yield this.client.submitTransaction(accountFrom, signedTxn);
            return res["hash"].toString();
        });
    }
}
exports.RestClient = RestClient;
class WalletClient {
    constructor(node_url, faucet_url) {
        this.faucetClient = new faucet_client_1.FaucetClient(node_url, faucet_url);
        this.aptosClient = new aptos_client_1.AptosClient(node_url);
        this.restClient = new RestClient(node_url);
        this.tokenClient = new token_client_1.TokenClient(this.aptosClient);
    }
    getAccountFromMnemonic(code, address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bip39.validateMnemonic(code, english.wordlist)) {
                return Promise.reject('Incorrect mnemonic passed');
            }
            var seed = bip39.mnemonicToSeedSync(code.toString());
            const account = new aptos_account_1.AptosAccount(seed.slice(0, 32), address);
            return Promise.resolve(account);
        });
    }
    createWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            var code = bip39.generateMnemonic(english.wordlist); // secret recovery phrase
            const account = yield this.getAccountFromMnemonic(code).catch((msg) => {
                return Promise.reject(msg);
            });
            yield this.faucetClient.fundAccount(account.authKey(), 10);
            return Promise.resolve({
                "code": code,
                "address key": account.address().noPrefix()
            });
        });
    }
    getUninitializedAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            var code = bip39.generateMnemonic(english.wordlist); // secret recovery phrase
            const account = yield this.getAccountFromMnemonic(code).catch((msg) => {
                return Promise.reject(msg);
            });
            return Promise.resolve({
                "code": code,
                "auth_key": account.authKey(),
                "address key": account.address().noPrefix()
            });
        });
    }
    importWallet(code, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.getAccountFromMnemonic(code, address).catch((msg) => {
                return Promise.reject(msg);
            });
            yield this.faucetClient.fundAccount(account.authKey(), 10);
            return Promise.resolve({
                "auth_key": account.authKey(),
                "address key": account.address().noPrefix()
            });
        });
    }
    airdrop(address, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.faucetClient.fundAccount(address, amount);
        });
    }
    getBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            var balance = yield this.restClient.accountBalance(address);
            return Promise.resolve(balance);
        });
    }
    transfer(code, recipient_address, amount, sender_address) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.getAccountFromMnemonic(code, sender_address).catch((msg) => {
                return Promise.reject(msg);
            });
            const txHash = yield this.restClient.transfer(account, recipient_address, amount);
            yield this.restClient.waitForTransaction(txHash).then(() => Promise.resolve(true)).catch((msg) => Promise.reject(msg));
        });
    }
    getSentEvents(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.restClient.accountSentEvents(address);
        });
    }
    getReceivedEvents(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.restClient.accountReceivedEvents(address);
        });
    }
    createNFTCollection(code, name, description, uri, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.getAccountFromMnemonic(code, address).catch((msg) => {
                return Promise.reject(msg);
            });
            return yield this.tokenClient.createCollection(account, name, description, uri);
        });
    }
    createNFT(code, collection_name, name, description, supply, uri, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.getAccountFromMnemonic(code, address).catch((msg) => {
                return Promise.reject(msg);
            });
            return yield this.tokenClient.createToken(account, collection_name, name, description, supply, uri);
        });
    }
    offerNFT(code, receiver_address, creator_address, collection_name, token_name, amount, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.getAccountFromMnemonic(code, address).catch((msg) => {
                return Promise.reject(msg);
            });
            return yield this.tokenClient.offerToken(account, receiver_address, creator_address, collection_name, token_name, amount);
        });
    }
    cancelNFTOffer(code, receiver_address, creator_address, collection_name, token_name, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.getAccountFromMnemonic(code, address).catch((msg) => {
                return Promise.reject(msg);
            });
            const token_id = yield this.tokenClient.getTokenId(creator_address, collection_name, token_name);
            return yield this.tokenClient.cancelTokenOffer(account, receiver_address, creator_address, token_id);
        });
    }
    claimNFT(code, sender_address, creator_address, collection_name, token_name, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.getAccountFromMnemonic(code, address).catch((msg) => {
                return Promise.reject(msg);
            });
            return yield this.tokenClient.claimToken(account, sender_address, creator_address, collection_name, token_name);
        });
    }
    signGenericTransaction(code, func, address, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.getAccountFromMnemonic(code, address).catch((msg) => {
                return Promise.reject(msg);
            });
            const payload = {
                type: "script_function_payload",
                function: func,
                type_arguments: [],
                arguments: args
            };
            return yield this.tokenClient.submitTransactionHelper(account, payload);
        });
    }
    getAccountResources(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.aptosClient.getAccountResources(accountAddress);
        });
    }
    // async rotateAuthKey(code: string, currAddress: string) {
    //     const alice = await this.getAccountFromMnemonic(code, currAddress).catch((msg) => {
    //         return Promise.reject(msg);
    //     });
    //     const newKeys = await this.getUninitializedAccount();
    //     const payload2: { function: string; arguments: string[]; type: string; type_arguments: any[] } = {
    //         type: "script_function_payload",
    //         function: "0x1::AptosAccount::rotate_authentication_key",
    //         type_arguments: [],
    //         arguments: [
    //             new_auth_key,
    //         ]
    //     }
    //     await this.tokenClient.submitTransactionHelper(oldAlice, payload2);
    //     const payload: { function: string; arguments: string[]; type: string; type_arguments: any[] } = {
    //         type: "script_function_payload",
    //         function: "0x3e4eeee8e135792f991d107eb92d927e12d811a587df2c13523c548754a24c3a::MartianWallet::set_address",
    //         type_arguments: [],
    //         arguments: [
    //           `0x${currAddress}`,
    //         ]
    //     } 
    //     return await this.tokenClient.submitTransactionHelper(newAlice, payload);
    // }
    // /** Retrieve the collection **/
    // async getCollection(creator: string, collection_name: string): Promise<number> {
    //     const resources: Types.AccountResource[] = await this.aptosClient.getAccountResources(creator);
    //     const accountResource: { type: string; data: any } = resources.find((r) => r.type === "0x1::Token::Collections");
    //     let collection = await this.tokenClient.tableItem(
    //         accountResource.data.collections.handle,
    //         "0x1::ASCII::String",
    //         "0x1::Token::Collection",
    //         collection_name,
    //     );
    //     return collection
    // }
    // // /** Retrieve the token **/
    // async getTokens(creator: string, collection_name: string, token_name: string): Promise<number> {
    //     v tokens = []
    //     const resources: Types.AccountResource[] = await this.aptosClient.getAccountResources(creator);
    //     const accountResource: { type: string; data: any } = resources.find((r) => r.type === "0x1::Token::Collections");
    //     let collection = await this.tokenClient.tableItem(
    //         accountResource.data.collections.handle,
    //         "0x1::ASCII::String",
    //         "0x1::Token::Collection",
    //         collection_name,
    //     );
    //     let tokenData = await this.tokenClient.tableItem(
    //         collection["tokens"]["handle"],
    //         "0x1::ASCII::String",
    //         "0x1::Token::TokenData",
    //         token_name,
    //     );
    //     return tokenData["id"]["creation_num"]
    // }
    getEventStream(address, eventHandleStruct, fieldName) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, cross_fetch_1.default)(`${this.aptosClient.nodeUrl}/accounts/${address}/events/${eventHandleStruct}/${fieldName}`, {
                method: "GET"
            });
            if (response.status == 404) {
                return [];
            }
            return yield response.json();
        });
    }
    // returns a list of token IDs of the tokens in a user's account (including the tokens that were minted)
    getTokenIds(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const depositEvents = yield this.getEventStream(address, "0x1::Token::TokenStore", "deposit_events");
            const withdrawEvents = yield this.getEventStream(address, "0x1::Token::TokenStore", "withdraw_events");
            function isEventEqual(event1, event2) {
                return event1.data.id.creator === event2.data.id.creator && event1.data.id.collectionName === event2.data.id.collectionName && event1.data.id.name === event2.data.id.name;
            }
            var tokenIds = [];
            for (var elem of depositEvents) {
                if (!withdrawEvents.some(function (item) {
                    return isEventEqual(item, elem);
                })) {
                    tokenIds.push(elem.data.id);
                }
            }
            return tokenIds;
        });
    }
    getTokens(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenIds = yield this.getTokenIds(address);
            var tokens = [];
            for (var tokenId of tokenIds) {
                const resources = yield this.aptosClient.getAccountResources(tokenId.creator);
                const accountResource = resources.find((r) => r.type === "0x1::Token::Collections");
                let token = yield this.tokenClient.tableItem(accountResource.data.token_data.handle, "0x1::Token::TokenId", "0x1::Token::TokenData", tokenId);
                tokens.push(token);
            }
            return tokens;
        });
    }
    getToken(tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resources = yield this.aptosClient.getAccountResources(tokenId.creator);
            const accountResource = resources.find((r) => r.type === "0x1::Token::Collections");
            let token = yield this.tokenClient.tableItem(accountResource.data.token_data.handle, "0x1::Token::TokenId", "0x1::Token::TokenData", tokenId);
            return token;
        });
    }
    // returns the collection data of a user
    getCollection(address, collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const resources = yield this.aptosClient.getAccountResources(address);
            const accountResource = resources.find((r) => r.type === "0x1::Token::Collections");
            let collection = yield this.tokenClient.tableItem(accountResource.data.token_data.handle, "ASCII::String", "0x1::Token::Collections", collectionName);
            return collection;
        });
    }
    getCustomResource(address, resourceType, fieldName, keyType, valueType, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const resources = yield this.aptosClient.getAccountResources(address);
            const accountResource = resources.find((r) => r.type === resourceType);
            let resource = yield this.tokenClient.tableItem(accountResource.data[fieldName].handle, keyType, valueType, key);
            return resource;
        });
    }
}
exports.WalletClient = WalletClient;
//# sourceMappingURL=wallet_client.js.map