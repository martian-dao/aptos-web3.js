"use strict";
// Copyright (c) The Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
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
exports.claimNFT = exports.cancelNFTOffer = exports.offerNFT = exports.createNFT = exports.createNFTCollection = exports.getReceivedEvents = exports.getSentEvents = exports.transfer = exports.getBalance = exports.airdrop = exports.importWallet = exports.createWallet = exports.TokenClient = exports.FaucetClient = exports.RestClient = exports.Account = exports.FAUCET_URL = exports.TESTNET_URL = void 0;
const SHA3 = require("js-sha3");
const cross_fetch_1 = require("cross-fetch");
const Nacl = require("tweetnacl");
const assert = require("assert");
exports.TESTNET_URL = "https://fullnode.devnet.aptoslabs.com";
exports.FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
const bip39 = require("@scure/bip39");
const english = require("@scure/bip39/wordlists/english");
/** Represents an account as well as the private, public key-pair for the Aptos blockchain */
class Account {
    constructor(seed) {
        if (seed) {
            this.signingKey = Nacl.sign.keyPair.fromSeed(seed);
        }
        else {
            this.signingKey = Nacl.sign.keyPair();
        }
    }
    /** Returns the address associated with the given account */
    address() {
        return this.authKey();
    }
    /** Returns the authKey for the associated account */
    authKey() {
        let hash = SHA3.sha3_256.create();
        hash.update(Buffer.from(this.signingKey.publicKey));
        hash.update("\x00");
        return hash.hex();
    }
    /** Returns the public key for the associated account */
    pubKey() {
        return Buffer.from(this.signingKey.publicKey).toString("hex");
    }
}
exports.Account = Account;
/** A wrapper around the Aptos-core Rest API */
class RestClient {
    constructor(url) {
        this.url = url;
    }
    /** Returns the sequence number and authentication key for an account */
    account(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, cross_fetch_1.default)(`${this.url}/accounts/${accountAddress}`, { method: "GET" });
            if (response.status != 200) {
                assert(response.status == 200, yield response.text());
            }
            return yield response.json();
        });
    }
    /** Returns all resources associated with the account */
    accountResources(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, cross_fetch_1.default)(`${this.url}/accounts/${accountAddress}/resources`, { method: "GET" });
            if (response.status != 200) {
                assert(response.status == 200, yield response.text());
            }
            return yield response.json();
        });
    }
    accountSentEvents(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, cross_fetch_1.default)(`${this.url}/accounts/${accountAddress}/events/0x1::TestCoin::TransferEvents/sent_events`, { method: "GET" });
            if (response.status != 200) {
                assert(response.status == 200, yield response.text());
            }
            return yield response.json();
        });
    }
    accountReceivedEvents(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, cross_fetch_1.default)(`${this.url}/accounts/${accountAddress}/events/0x1::TestCoin::TransferEvents/received_events`, { method: "GET" });
            if (response.status != 200) {
                assert(response.status == 200, yield response.text());
            }
            return yield response.json();
        });
    }
    /** Generates a transaction request that can be submitted to produce a raw transaction that
     can be signed, which upon being signed can be submitted to the blockchain. */
    generateTransaction(sender, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.account(sender);
            const seqNum = parseInt(account["sequence_number"]);
            return {
                "sender": `0x${sender}`,
                "sequence_number": seqNum.toString(),
                "max_gas_amount": "4000",
                "gas_unit_price": "1",
                "gas_currency_code": "XUS",
                // Unix timestamp, in seconds + 10 minutes
                "expiration_timestamp_secs": (Math.floor(Date.now() / 1000) + 600).toString(),
                "payload": payload,
            };
        });
    }
    /** Converts a transaction request produced by `generate_transaction` into a properly signed
     transaction, which can then be submitted to the blockchain. */
    signTransaction(accountFrom, txnRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, cross_fetch_1.default)(`${this.url}/transactions/signing_message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(txnRequest)
            });
            if (response.status != 200) {
                assert(response.status == 200, (yield response.text()) + " - " + JSON.stringify(txnRequest));
            }
            const result = yield response.json();
            const toSign = Buffer.from(result["message"].substring(2), "hex");
            const signature = Nacl.sign(toSign, accountFrom.signingKey.secretKey);
            const signatureHex = Buffer.from(signature).toString("hex").slice(0, 128);
            txnRequest["signature"] = {
                "type": "ed25519_signature",
                "public_key": `0x${accountFrom.pubKey()}`,
                "signature": `0x${signatureHex}`,
            };
            return txnRequest;
        });
    }
    /** Submits a signed transaction to the blockchain. */
    submitTransaction(accountFrom, txnRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, cross_fetch_1.default)(`${this.url}/transactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(txnRequest)
            });
            if (response.status != 202) {
                assert(response.status == 202, (yield response.text()) + " - " + JSON.stringify(txnRequest));
            }
            return yield response.json();
        });
    }
    transactionPending(txnHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, cross_fetch_1.default)(`${this.url}/transactions/${txnHash}`, { method: "GET" });
            if (response.status == 404) {
                return true;
            }
            if (response.status != 200) {
                assert(response.status == 200, yield response.text());
            }
            return (yield response.json())["type"] == "pending_transaction";
        });
    }
    /** Waits up to 10 seconds for a transaction to move past pending state */
    waitForTransaction(txnHash) {
        return __awaiter(this, void 0, void 0, function* () {
            let count = 0;
            while (yield this.transactionPending(txnHash)) {
                assert(count < 10);
                yield new Promise(resolve => setTimeout(resolve, 1000));
                count += 1;
                if (count >= 10) {
                    throw new Error(`Waiting for transaction ${txnHash} timed out!`);
                }
            }
        });
    }
    /** Returns the test coin balance associated with the account */
    accountBalance(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const resources = yield this.accountResources(accountAddress);
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
                    `0x${recipient}`,
                    amount.toString(),
                ]
            };
            const txnRequest = yield this.generateTransaction(accountFrom.address(), payload);
            const signedTxn = yield this.signTransaction(accountFrom, txnRequest);
            const res = yield this.submitTransaction(accountFrom, signedTxn);
            return res["hash"].toString();
        });
    }
}
exports.RestClient = RestClient;
/** Faucet creates and funds accounts. This is a thin wrapper around that. */
class FaucetClient {
    constructor(url, restClient) {
        this.url = url;
        this.restClient = restClient;
    }
    /** This creates an account if it does not exist and mints the specified amount of
     coins into that account */
    fundAccount(authKey, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.url}/mint?amount=${amount}&auth_key=${authKey}`;
            const response = yield (0, cross_fetch_1.default)(url, { method: "POST" });
            if (response.status != 200) {
                assert(response.status == 200, yield response.text());
            }
            const tnxHashes = yield response.json();
            for (const tnxHash of tnxHashes) {
                yield this.restClient.waitForTransaction(tnxHash);
            }
        });
    }
}
exports.FaucetClient = FaucetClient;
class TokenClient {
    constructor(restClient) {
        this.restClient = restClient;
    }
    submitTransactionHelper(account, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const txn_request = yield this.restClient.generateTransaction(account.address(), payload);
            const signed_txn = yield this.restClient.signTransaction(account, txn_request);
            const res = yield this.restClient.submitTransaction(account, signed_txn);
            yield this.restClient.waitForTransaction(res["hash"]);
            return Promise.resolve(res["hash"]);
        });
    }
    /** Creates a new collection within the specified account */
    createCollection(account, description, name, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "script_function_payload",
                function: "0x1::Token::create_unlimited_collection_script",
                type_arguments: [],
                arguments: [
                    Buffer.from(description).toString("hex"),
                    Buffer.from(name).toString("hex"),
                    Buffer.from(uri).toString("hex"),
                ]
            };
            return yield this.submitTransactionHelper(account, payload);
        });
    }
    createToken(account, collection_name, description, name, supply, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "script_function_payload",
                function: "0x1::Token::create_token_script",
                type_arguments: [],
                arguments: [
                    Buffer.from(collection_name).toString("hex"),
                    Buffer.from(description).toString("hex"),
                    Buffer.from(name).toString("hex"),
                    supply.toString(),
                    Buffer.from(uri).toString("hex")
                ]
            };
            return yield this.submitTransactionHelper(account, payload);
        });
    }
    offerToken(account, receiver, creator, token_creation_num, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "script_function_payload",
                function: "0x1::TokenTransfers::offer_script",
                type_arguments: [],
                arguments: [
                    receiver,
                    creator,
                    token_creation_num.toString(),
                    amount.toString()
                ]
            };
            return yield this.submitTransactionHelper(account, payload);
        });
    }
    claimToken(account, sender, creator, token_creation_num) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "script_function_payload",
                function: "0x1::TokenTransfers::claim_script",
                type_arguments: [],
                arguments: [
                    sender,
                    creator,
                    token_creation_num.toString(),
                ]
            };
            return yield this.submitTransactionHelper(account, payload);
        });
    }
    cancelTokenOffer(account, receiver, creator, token_creation_num) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "script_function_payload",
                function: "0x1::TokenTransfers::cancel_offer_script",
                type_arguments: [],
                arguments: [
                    receiver,
                    creator,
                    token_creation_num.toString()
                ]
            };
            return yield this.submitTransactionHelper(account, payload);
        });
    }
    /** Retrieve the token's creation_num, which is useful for non-creator operations */
    getTokenId(creator, collection_name, token_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const resources = yield this.restClient.accountResources(creator);
            let collections = [];
            let tokens = [];
            for (var resource in resources) {
                if (resources[resource]["type"] == "0x1::Token::Collections") {
                    collections = resources[resource]["data"]["collections"]["data"];
                }
            }
            for (var collection in collections) {
                if (collections[collection]["key"] == collection_name) {
                    tokens = collections[collection]["value"]["tokens"]["data"];
                }
            }
            for (var token in tokens) {
                if (tokens[token]["key"] == token_name) {
                    return parseInt(tokens[token]["value"]["id"]["creation_num"]);
                }
            }
            assert(false);
        });
    }
}
exports.TokenClient = TokenClient;
function getAccountFromMnemonic(code) {
    if (!bip39.validateMnemonic(code, english.wordlist)) {
        return Promise.reject('Incorrect mnemonic passed');
    }
    var seed = bip39.mnemonicToSeedSync(code.toString());
    const alice = new Account(seed.slice(0, 32));
    return Promise.resolve(alice);
}
function createWallet() {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = new RestClient(exports.TESTNET_URL);
        const faucetClient = new FaucetClient(exports.FAUCET_URL, restClient);
        var code = bip39.generateMnemonic(english.wordlist); // secret recovery phrase
        const alice = yield getAccountFromMnemonic(code).catch((msg) => {
            return Promise.reject(msg);
        });
        yield faucetClient.fundAccount(alice.authKey(), 10);
        return Promise.resolve({
            "code": code,
            "address key": alice.address()
        });
    });
}
exports.createWallet = createWallet;
function importWallet(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = new RestClient(exports.TESTNET_URL);
        const faucetClient = new FaucetClient(exports.FAUCET_URL, restClient);
        const alice = yield getAccountFromMnemonic(code).catch((msg) => {
            return Promise.reject(msg);
        });
        yield faucetClient.fundAccount(alice.authKey(), 10);
        return Promise.resolve({
            "address key": alice.address()
        });
    });
}
exports.importWallet = importWallet;
function airdrop(code, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = new RestClient(exports.TESTNET_URL);
        const faucetClient = new FaucetClient(exports.FAUCET_URL, restClient);
        const alice = yield getAccountFromMnemonic(code).catch((msg) => {
            return Promise.reject(msg);
        });
        yield faucetClient.fundAccount(alice.authKey(), amount).then(() => Promise.resolve(true)).catch((msg) => Promise.reject(msg));
    });
}
exports.airdrop = airdrop;
function getBalance(address) {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = new RestClient(exports.TESTNET_URL);
        var balance = yield restClient.accountBalance(address);
        return Promise.resolve(balance);
    });
}
exports.getBalance = getBalance;
function transfer(code, recipient_address, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = new RestClient(exports.TESTNET_URL);
        const alice = yield getAccountFromMnemonic(code).catch((msg) => {
            return Promise.reject(msg);
        });
        const txHash = yield restClient.transfer(alice, recipient_address, amount);
        yield restClient.waitForTransaction(txHash).then(() => Promise.resolve(true)).catch((msg) => Promise.reject(msg));
    });
}
exports.transfer = transfer;
function getSentEvents(address) {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = new RestClient(exports.TESTNET_URL);
        return yield restClient.accountSentEvents(address);
    });
}
exports.getSentEvents = getSentEvents;
function getReceivedEvents(address) {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = new RestClient(exports.TESTNET_URL);
        return yield restClient.accountReceivedEvents(address);
    });
}
exports.getReceivedEvents = getReceivedEvents;
function createNFTCollection(code, description, name, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = new RestClient(exports.TESTNET_URL);
        const tokenClient = new TokenClient(restClient);
        const alice = yield getAccountFromMnemonic(code).catch((msg) => {
            return Promise.reject(msg);
        });
        return yield tokenClient.createCollection(alice, description, name, uri);
    });
}
exports.createNFTCollection = createNFTCollection;
function createNFT(code, collection_name, description, name, supply, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = new RestClient(exports.TESTNET_URL);
        const tokenClient = new TokenClient(restClient);
        const alice = yield getAccountFromMnemonic(code).catch((msg) => {
            return Promise.reject(msg);
        });
        return yield tokenClient.createToken(alice, collection_name, description, name, supply, uri);
    });
}
exports.createNFT = createNFT;
function offerNFT(code, receiver_address, creator_address, collection_name, token_name, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = new RestClient(exports.TESTNET_URL);
        const tokenClient = new TokenClient(restClient);
        const alice = yield getAccountFromMnemonic(code).catch((msg) => {
            return Promise.reject(msg);
        });
        const token_id = yield tokenClient.getTokenId(creator_address, collection_name, token_name);
        return yield tokenClient.offerToken(alice, receiver_address, creator_address, token_id, amount);
    });
}
exports.offerNFT = offerNFT;
function cancelNFTOffer(code, receiver_address, creator_address, collection_name, token_name) {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = new RestClient(exports.TESTNET_URL);
        const tokenClient = new TokenClient(restClient);
        const alice = yield getAccountFromMnemonic(code).catch((msg) => {
            return Promise.reject(msg);
        });
        const token_id = yield tokenClient.getTokenId(creator_address, collection_name, token_name);
        return yield tokenClient.cancelTokenOffer(alice, receiver_address, creator_address, token_id);
    });
}
exports.cancelNFTOffer = cancelNFTOffer;
function claimNFT(code, sender_address, creator_address, collection_name, token_name) {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = new RestClient(exports.TESTNET_URL);
        const tokenClient = new TokenClient(restClient);
        const alice = yield getAccountFromMnemonic(code).catch((msg) => {
            return Promise.reject(msg);
        });
        const token_id = yield tokenClient.getTokenId(creator_address, collection_name, token_name);
        return yield tokenClient.claimToken(alice, sender_address, creator_address, token_id);
    });
}
exports.claimNFT = claimNFT;
