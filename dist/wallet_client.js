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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletClient = exports.RestClient = void 0;
const aptos_account_1 = require("./aptos_account");
const token_client_1 = require("./token_client");
const aptos_client_1 = require("./aptos_client");
const faucet_client_1 = require("./faucet_client");
const hex_string_1 = require("./hex_string");
const bip39 = __importStar(require("@scure/bip39"));
const english = __importStar(require("@scure/bip39/wordlists/english"));
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
    createNFTCollection(code, description, name, uri, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.getAccountFromMnemonic(code, address).catch((msg) => {
                return Promise.reject(msg);
            });
            return yield this.tokenClient.createCollection(account, description, name, uri);
        });
    }
    createNFT(code, collection_name, description, name, supply, uri, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.getAccountFromMnemonic(code, address).catch((msg) => {
                return Promise.reject(msg);
            });
            return yield this.tokenClient.createToken(account, collection_name, description, name, supply, uri);
        });
    }
    offerNFT(code, receiver_address, creator_address, collection_name, token_name, amount, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.getAccountFromMnemonic(code, address).catch((msg) => {
                return Promise.reject(msg);
            });
            const token_id = yield this.tokenClient.getTokenId(creator_address, collection_name, token_name);
            return yield this.tokenClient.offerToken(account, receiver_address, creator_address, token_id, amount);
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
            const token_id = yield this.tokenClient.getTokenId(creator_address, collection_name, token_name);
            return yield this.tokenClient.claimToken(account, sender_address, creator_address, token_id);
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
    rotateAuthKey(code, new_auth_key, currAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const alice = yield this.getAccountFromMnemonic(code, currAddress).catch((msg) => {
                return Promise.reject(msg);
            });
            const payload = {
                type: "script_function_payload",
                function: "0x1::AptosAccount::rotate_authentication_key",
                type_arguments: [],
                arguments: [
                    new_auth_key,
                ]
            };
            return yield this.tokenClient.submitTransactionHelper(alice, payload);
        });
    }
}
exports.WalletClient = WalletClient;
//# sourceMappingURL=wallet_client.js.map