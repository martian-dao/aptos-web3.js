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
// import BIP32Factory from 'bip32';
// import * as ecc from 'tiny-secp256k1';
// import { BIP32Interface } from 'bip32';
const { HDKey } = require("@scure/bip32");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const assert_1 = __importDefault(require("assert"));
// const bip32 = BIP32Factory(ecc);
const COIN_TYPE = 123420;
const MAX_ACCOUNTS = 5;
const ADDRESS_GAP = 10;
/** A wrapper around the Aptos-core Rest API */
class RestClient {
    constructor(url) {
        this.client = new aptos_client_1.AptosClient(url);
    }
    accountSentEvents(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.getEventsByEventHandle(accountAddress, "0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>", "withdraw_events");
        });
    }
    accountReceivedEvents(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.getEventsByEventHandle(accountAddress, "0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>", "deposit_events");
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
    getTransactionStatus(txnHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.client.getTransaction(txnHash);
            return resp['success'];
        });
    }
    /** Returns the test coin balance associated with the account */
    accountBalance(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const resources = yield this.client.getAccountResources(accountAddress);
            for (const key in resources) {
                const resource = resources[key];
                if (resource["type"] == "0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>") {
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
                function: "0x1::Coin::transfer",
                type_arguments: ["0x1::TestCoin::TestCoin"],
                arguments: [`${hex_string_1.HexString.ensure(recipient)}`, amount.toString()],
            };
            const txnRequest = yield this.client.generateTransaction(accountFrom.address(), payload);
            const signedTxn = yield this.client.signTransaction(accountFrom, txnRequest);
            const res = yield this.client.submitTransaction(accountFrom, signedTxn);
            return res["hash"].toString();
        });
    }
    accountResource(accountAddress, resourceType) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, cross_fetch_1.default)(`${this.client.nodeUrl}/accounts/${accountAddress}/resource/${resourceType}`, { method: "GET" });
            if (response.status == 404) {
                return null;
            }
            if (response.status != 200) {
                (0, assert_1.default)(response.status == 200, yield response.text());
            }
            return yield response.json();
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
    // Get all the accounts of a user from their mnemonic
    importWallet(code) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bip39.validateMnemonic(code, english.wordlist)) {
                return Promise.reject("Incorrect mnemonic passed");
            }
            var seed = bip39.mnemonicToSeedSync(code.toString());
            const node = HDKey.fromMasterSeed(Buffer.from(seed));
            var accountMetaData = [];
            for (var i = 0; i < MAX_ACCOUNTS; i++) {
                var flag = false;
                var address = "";
                var derivationPath = "";
                var authKey = "";
                for (var j = 0; j < ADDRESS_GAP; j++) {
                    const exKey = node.derive(`m/44'/${COIN_TYPE}'/${i}'/0/${j}`);
                    let acc = new aptos_account_1.AptosAccount(exKey.privateKey);
                    if (j == 0) {
                        address = acc.authKey().toString();
                        const response = yield (0, cross_fetch_1.default)(`${this.aptosClient.nodeUrl}/accounts/${address}`, {
                            method: "GET",
                        });
                        if (response.status == 404) {
                            break;
                        }
                        const respBody = yield response.json();
                        authKey = respBody.authentication_key;
                    }
                    acc = new aptos_account_1.AptosAccount(exKey.privateKey, address);
                    if (acc.authKey().toString() === authKey) {
                        flag = true;
                        derivationPath = `m/44'/${COIN_TYPE}'/${i}'/0/${j}`;
                        break;
                    }
                }
                if (!flag) {
                    break;
                }
                accountMetaData.push({
                    derivationPath: derivationPath,
                    address: address,
                });
            }
            return { code: code, accounts: accountMetaData };
        });
    }
    createWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            var code = bip39.generateMnemonic(english.wordlist); // mnemonic
            var accountMetadata = yield this.createNewAccount(code);
            return { code: code, accounts: [accountMetadata] };
        });
    }
    createNewAccount(code) {
        return __awaiter(this, void 0, void 0, function* () {
            var seed = bip39.mnemonicToSeedSync(code.toString());
            const node = HDKey.fromMasterSeed(Buffer.from(seed));
            for (var i = 0; i < MAX_ACCOUNTS; i++) {
                const derivationPath = `m/44'/${COIN_TYPE}'/${i}'/0/0`;
                const exKey = node.derive(derivationPath);
                let acc = new aptos_account_1.AptosAccount(exKey.privateKey);
                const address = acc.authKey().toString();
                const response = yield (0, cross_fetch_1.default)(`${this.aptosClient.nodeUrl}/accounts/${address}`, {
                    method: "GET",
                });
                if (response.status != 404) {
                    const respBody = yield response.json();
                    console.log(i);
                    console.log(respBody.authentication_key);
                    continue;
                }
                yield this.faucetClient.fundAccount(acc.authKey(), 0);
                return { derivationPath: derivationPath, address: address };
            }
            throw new Error("Max no. of accounts reached");
        });
    }
    getAccountFromPrivateKey(privateKey, address) {
        return __awaiter(this, void 0, void 0, function* () {
            return new aptos_account_1.AptosAccount(privateKey, address);
        });
    }
    // gives the account at position m/44'/COIN_TYPE'/0'/0/0
    getAccountFromMnemonic(code) {
        return __awaiter(this, void 0, void 0, function* () {
            var seed = bip39.mnemonicToSeedSync(code.toString());
            const node = HDKey.fromMasterSeed(Buffer.from(seed));
            const exKey = node.derive(`m/44'/${COIN_TYPE}'/0'/0/0`);
            return new aptos_account_1.AptosAccount(exKey.privateKey);
        });
    }
    getAccountFromMetaData(code, metaData) {
        return __awaiter(this, void 0, void 0, function* () {
            var seed = bip39.mnemonicToSeedSync(code.toString());
            const node = HDKey.fromMasterSeed(Buffer.from(seed));
            const exKey = node.derive(metaData.derivationPath);
            return new aptos_account_1.AptosAccount(exKey.privateKey, metaData.address);
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
    accountTransactions(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.restClient.client.getAccountTransactions(accountAddress);
            const transactions = data.map((item) => ({
                data: item.payload,
                from: item.sender,
                gas: item.gas_used,
                gasPrice: item.gas_unit_price,
                hash: item.hash,
                success: item.success,
                timestamp: item.timestamp,
                toAddress: item.payload.arguments[0],
                price: item.payload.arguments[1],
                type: item.type,
                version: item.version,
                vmStatus: item.vm_status,
            }));
            return transactions;
        });
    }
    transfer(account, recipient_address, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (recipient_address.toString() === account.address().toString()) {
                    Promise.reject("cannot transfer coins to self");
                }
                const balance = yield this.getBalance(account.address());
                // balance should be greater tham amount + static gas amount
                if (balance < amount + 150) {
                    Promise.reject("insufficient balance (including gas fees)");
                }
                const txHash = yield this.restClient.transfer(account, recipient_address, amount);
                this.restClient
                    .waitForTransaction(txHash)
                    .then(() => Promise.resolve(true))
                    .catch((msg) => {
                    Promise.reject(msg);
                });
            }
            catch (err) {
                const message = err.response.data.message;
                if (message.includes("caused by error")) {
                    Promise.reject(message.split("caused by error:").pop().trim());
                }
                else {
                    Promise.reject(message);
                }
            }
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
    createCollection(account, name, description, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            // const collection = await this.getCollection(account.address().toString(), name);
            // if(collection){
            //     Promise.reject("collection already present");
            //     return
            // }
            return yield this.tokenClient.createCollection(account, name, description, uri);
        });
    }
    createToken(account, collection_name, name, description, supply, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tokenClient.createToken(account, collection_name, name, description, supply, uri);
        });
    }
    offerToken(account, receiver_address, creator_address, collection_name, token_name, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tokenClient.offerToken(account, receiver_address, creator_address, collection_name, token_name, amount);
        });
    }
    cancelTokenOffer(account, receiver_address, creator_address, collection_name, token_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const token_id = yield this.tokenClient.getTokenId(creator_address, collection_name, token_name);
            return yield this.tokenClient.cancelTokenOffer(account, receiver_address, creator_address, token_id);
        });
    }
    claimNFT(account, sender_address, creator_address, collection_name, token_name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tokenClient.claimToken(account, sender_address, creator_address, collection_name, token_name);
        });
    }
    signGenericTransaction(account, func, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "script_function_payload",
                function: func,
                type_arguments: [],
                arguments: args,
            };
            const transactionHash = yield this.tokenClient.submitTransactionHelper(account, payload);
            const success = yield this.restClient.getTransactionStatus(transactionHash);
            return { txnHash: transactionHash, success: success };
        });
    }
    rotateAuthKey(code, metaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.getAccountFromMetaData(code, metaData);
            const pathSplit = metaData.derivationPath.split("/");
            const address_index = parseInt(pathSplit[pathSplit.length - 1]);
            if (address_index >= ADDRESS_GAP - 1) {
                throw new Error("Maximum key rotation reached");
            }
            const newDerivationPath = `${pathSplit
                .slice(0, pathSplit.length - 1)
                .join("/")}/${address_index + 1}`;
            const newAccount = yield this.getAccountFromMetaData(code, {
                address: metaData.address,
                derivationPath: newDerivationPath,
            });
            var newAuthKey = newAccount.authKey().toString().split("0x")[1];
            console.log(newAuthKey);
            return yield this.signGenericTransaction(account, "0x1::Account::rotate_authentication_key", newAuthKey);
        });
    }
    getEventStream(address, eventHandleStruct, fieldName) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, cross_fetch_1.default)(`${this.aptosClient.nodeUrl}/accounts/${address}/events/${eventHandleStruct}/${fieldName}`, {
                method: "GET",
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
                return (event1.data.id.creator === event2.data.id.creator &&
                    event1.data.id.collectionName === event2.data.id.collectionName &&
                    event1.data.id.name === event2.data.id.name);
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
            let collection = yield this.tokenClient.tableItem(accountResource.data.collections.handle, "0x1::ASCII::String", "0x1::Token::Collection", collectionName);
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
    ///////////// fungible tokens (coins)
    initiateCoin(account, type_parameter, name, scaling_factor) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "script_function_payload",
                function: "0x1::Coin::initialize",
                type_arguments: [type_parameter],
                arguments: [
                    Buffer.from(name).toString("hex"),
                    scaling_factor.toString(),
                    false,
                ],
            };
            yield this.tokenClient.submitTransactionHelper(account, payload);
        });
    }
    /** Registers the coin */
    registerCoin(account, type_parameter) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "script_function_payload",
                function: "0x1::Coin::register",
                type_arguments: [type_parameter],
                arguments: [],
            };
            yield this.tokenClient.submitTransactionHelper(account, payload);
        });
    }
    /** Mints the coin */
    mintCoin(account, type_parameter, dst_address, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "script_function_payload",
                function: "0x1::Coin::mint",
                type_arguments: [type_parameter],
                arguments: [dst_address.toString(), amount.toString()],
            };
            yield this.tokenClient.submitTransactionHelper(account, payload);
        });
    }
    /** Transfers the coins */
    transferCoin(account, type_parameter, to_address, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "script_function_payload",
                function: "0x1::Coin::transfer",
                type_arguments: [type_parameter],
                arguments: [to_address.toString(), amount.toString()],
            };
            yield this.tokenClient.submitTransactionHelper(account, payload);
        });
    }
    getCoinBalance(address, coin_address) {
        return __awaiter(this, void 0, void 0, function* () {
            const coin_info = yield this.restClient.accountResource(address, `0x1::Coin::CoinStore<${coin_address}>`);
            return coin_info["data"]["coin"]["value"];
        });
    }
}
exports.WalletClient = WalletClient;
//# sourceMappingURL=wallet_client.js.map