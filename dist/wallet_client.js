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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletClient = void 0;
const aptos_account_1 = require("./aptos_account");
const token_client_1 = require("./token_client");
const aptos_client_1 = require("./aptos_client");
const faucet_client_1 = require("./faucet_client");
const hex_string_1 = require("./hex_string");
const buffer_1 = require("buffer/");
const bip39 = __importStar(require("@scure/bip39"));
const english = __importStar(require("@scure/bip39/wordlists/english"));
const { HDKey } = require("@scure/bip32");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const assert_1 = __importDefault(require("assert"));
const COIN_TYPE = 123420;
const MAX_ACCOUNTS = 5;
const ADDRESS_GAP = 10;
class WalletClient {
    constructor(node_url, faucet_url) {
        this.faucetClient = new faucet_client_1.FaucetClient(node_url, faucet_url);
        this.aptosClient = new aptos_client_1.AptosClient(node_url);
        this.tokenClient = new token_client_1.TokenClient(this.aptosClient);
    }
    // Get all the accounts of a user from their mnemonic
    async importWallet(code) {
        if (!bip39.validateMnemonic(code, english.wordlist)) {
            return Promise.reject("Incorrect mnemonic passed");
        }
        var seed = bip39.mnemonicToSeedSync(code.toString());
        const node = HDKey.fromMasterSeed(buffer_1.Buffer.from(seed));
        var accountMetaData = [];
        for (var i = 0; i < MAX_ACCOUNTS; i++) {
            var flag = false;
            var address = "";
            var publicKey = "";
            var derivationPath = "";
            var authKey = "";
            for (var j = 0; j < ADDRESS_GAP; j++) {
                const exKey = node.derive(`m/44'/${COIN_TYPE}'/${i}'/0/${j}`);
                let acc = new aptos_account_1.AptosAccount(exKey.privateKey);
                if (j == 0) {
                    address = acc.authKey().toString();
                    publicKey = acc.pubKey().toString();
                    const response = await (0, cross_fetch_1.default)(`${this.aptosClient.nodeUrl}/accounts/${address}`, {
                        method: "GET",
                    });
                    if (response.status == 404) {
                        break;
                    }
                    const respBody = await response.json();
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
                publicKey: publicKey,
            });
        }
        return { code: code, accounts: accountMetaData };
    }
    async createWallet() {
        var code = bip39.generateMnemonic(english.wordlist); // mnemonic
        var accountMetadata = await this.createNewAccount(code);
        return { code: code, accounts: [accountMetadata] };
    }
    async createNewAccount(code) {
        var seed = bip39.mnemonicToSeedSync(code.toString());
        const node = HDKey.fromMasterSeed(buffer_1.Buffer.from(seed));
        for (var i = 0; i < MAX_ACCOUNTS; i++) {
            const derivationPath = `m/44'/${COIN_TYPE}'/${i}'/0/0`;
            const exKey = node.derive(derivationPath);
            let acc = new aptos_account_1.AptosAccount(exKey.privateKey);
            const address = acc.authKey().toString();
            const response = await (0, cross_fetch_1.default)(`${this.aptosClient.nodeUrl}/accounts/${address}`, {
                method: "GET",
            });
            if (response.status != 404) {
                const respBody = await response.json();
                continue;
            }
            await this.faucetClient.fundAccount(acc.authKey(), 0);
            return {
                derivationPath: derivationPath,
                address: address,
                publicKey: acc.pubKey().toString(),
            };
        }
        throw new Error("Max no. of accounts reached");
    }
    async getAccountFromPrivateKey(privateKey, address) {
        return new aptos_account_1.AptosAccount(privateKey, address);
    }
    // gives the account at position m/44'/COIN_TYPE'/0'/0/0
    async getAccountFromMnemonic(code) {
        var seed = bip39.mnemonicToSeedSync(code.toString());
        const node = HDKey.fromMasterSeed(buffer_1.Buffer.from(seed));
        const exKey = node.derive(`m/44'/${COIN_TYPE}'/0'/0/0`);
        return new aptos_account_1.AptosAccount(exKey.privateKey);
    }
    async getAccountFromMetaData(code, metaData) {
        var seed = bip39.mnemonicToSeedSync(code.toString());
        const node = HDKey.fromMasterSeed(buffer_1.Buffer.from(seed));
        const exKey = node.derive(metaData.derivationPath);
        return new aptos_account_1.AptosAccount(exKey.privateKey, metaData.address);
    }
    async airdrop(address, amount) {
        return await this.faucetClient.fundAccount(address, amount);
    }
    async getBalance(address) {
        var balance = 0;
        const resources = await this.aptosClient.getAccountResources(address);
        console.log(resources);
        for (const key in resources) {
            const resource = resources[key];
            if (resource["type"] == "0x1::coin::CoinStore<0x1::test_coin::TestCoin>") {
                console.log(balance);
                balance = parseInt(resource["data"]["coin"]["value"]);
            }
        }
        return Promise.resolve(balance);
    }
    async accountTransactions(accountAddress) {
        const data = await this.aptosClient.getAccountTransactions(accountAddress);
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
    }
    async transfer(account, recipient_address, amount) {
        try {
            if (recipient_address.toString() === account.address().toString()) {
                return Promise.reject("cannot transfer coins to self");
            }
            const payload = {
                type: "script_function_payload",
                function: "0x1::coin::transfer",
                type_arguments: ["0x1::test_coin::TestCoin"],
                arguments: [
                    `${hex_string_1.HexString.ensure(recipient_address)}`,
                    amount.toString(),
                ],
            };
            return await this.tokenClient.submitTransactionHelper(account, payload);
        }
        catch (err) {
            const message = err.response.data.message;
            if (message.includes("caused by error")) {
                return Promise.reject(message.split("caused by error:").pop().trim());
            }
            else {
                return Promise.reject(message);
            }
        }
    }
    async getSentEvents(address) {
        return await this.aptosClient.getAccountTransactions(address);
    }
    async getReceivedEvents(address) {
        return await this.aptosClient.getEventsByEventHandle(address, "0x1::coin::CoinStore<0x1::test_coin::TestCoin>", "deposit_events");
    }
    async createCollection(account, name, description, uri) {
        return await this.tokenClient.createCollection(account, name, description, uri);
    }
    async createToken(account, collection_name, name, description, supply, uri, royalty_points_per_million = 0) {
        return await this.tokenClient.createToken(account, collection_name, name, description, supply, uri, royalty_points_per_million);
    }
    async offerToken(account, receiver_address, creator_address, collection_name, token_name, amount) {
        return await this.tokenClient.offerToken(account, receiver_address, creator_address, collection_name, token_name, amount);
    }
    async cancelTokenOffer(account, receiver_address, creator_address, collection_name, token_name) {
        return await this.tokenClient.cancelTokenOffer(account, receiver_address, creator_address, collection_name, token_name);
    }
    async claimToken(account, sender_address, creator_address, collection_name, token_name) {
        return await this.tokenClient.claimToken(account, sender_address, creator_address, collection_name, token_name);
    }
    async signGenericTransaction(account, func, args, type_args) {
        const payload = {
            type: "script_function_payload",
            function: func,
            type_arguments: type_args,
            arguments: args,
        };
        const txnHash = await this.tokenClient.submitTransactionHelper(account, payload);
        const resp = await this.aptosClient.getTransaction(txnHash);
        const status = { success: resp["success"], vm_status: resp["vm_status"] };
        return { txnHash: txnHash, ...status };
    }
    async signAndSubmitTransaction(account, txnRequest) {
        const signedTxn = await this.aptosClient.signTransaction(account, txnRequest);
        const res = await this.aptosClient.submitTransaction(signedTxn);
        await this.aptosClient.waitForTransaction(res.hash);
        return Promise.resolve(res.hash);
    }
    async signTransaction(account, txnRequest) {
        return await this.aptosClient.signTransaction(account, txnRequest);
    }
    async submitTransaction(signedTxn) {
        return await this.aptosClient.submitTransaction(signedTxn);
    }
    generateBCSTransaction(account, rawTxn) {
        return Promise.resolve(aptos_client_1.AptosClient.generateBCSTransaction(account, rawTxn));
    }
    generateBCSSimulation(account, rawTxn) {
        return Promise.resolve(aptos_client_1.AptosClient.generateBCSSimulation(account, rawTxn));
    }
    async submitSignedBCSTransaction(signedTxn) {
        return await this.aptosClient.submitSignedBCSTransaction(signedTxn);
    }
    async submitBCSSimulation(bcsBody) {
        return await this.aptosClient.submitBCSSimulation(bcsBody);
    }
    async signMessage(account, message) {
        return account.signBuffer(buffer_1.Buffer.from(message)).hex();
    }
    async rotateAuthKey(code, metaData) {
        const account = await this.getAccountFromMetaData(code, metaData);
        const pathSplit = metaData.derivationPath.split("/");
        const address_index = parseInt(pathSplit[pathSplit.length - 1]);
        if (address_index >= ADDRESS_GAP - 1) {
            throw new Error("Maximum key rotation reached");
        }
        const newDerivationPath = `${pathSplit
            .slice(0, pathSplit.length - 1)
            .join("/")}/${address_index + 1}`;
        const newAccount = await this.getAccountFromMetaData(code, {
            address: metaData.address,
            derivationPath: newDerivationPath,
        });
        var newAuthKey = newAccount.authKey().toString().split("0x")[1];
        const transactionStatus = await this.signGenericTransaction(account, "0x1::account::rotate_authentication_key", [newAuthKey], []);
        if (!transactionStatus.success) {
            return {
                authkey: "",
                success: false,
                vm_status: transactionStatus.vm_status,
            };
        }
        return {
            authkey: "0x" + newAuthKey,
            success: true,
            vm_status: transactionStatus.vm_status,
        };
    }
    async getEventStream(address, eventHandleStruct, fieldName) {
        const response = await (0, cross_fetch_1.default)(`${this.aptosClient.nodeUrl}/accounts/${address}/events/${eventHandleStruct}/${fieldName}`, {
            method: "GET",
        });
        if (response.status == 404) {
            return [];
        }
        return await response.json();
    }
    // returns a list of token IDs of the tokens in a user's account (including the tokens that were minted)
    async getTokenIds(address) {
        const depositEvents = await this.getEventStream(address, "0x1::token::TokenStore", "deposit_events");
        const withdrawEvents = await this.getEventStream(address, "0x1::token::TokenStore", "withdraw_events");
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
    }
    async getTokens(address) {
        const tokenIds = await this.getTokenIds(address);
        var tokens = [];
        for (var tokenId of tokenIds) {
            const resources = await this.aptosClient.getAccountResources(tokenId.creator);
            const accountResource = resources.find((r) => r.type === "0x1::token::Collections");
            let tableItemRequest = {
                key_type: "0x1::token::TokenId",
                value_type: "0x1::token::TokenData",
                key: tokenId,
            };
            const token = (await this.aptosClient.getTableItem(accountResource.data.token_data.handle, tableItemRequest)).data;
            tokens.push(token);
        }
        return tokens;
    }
    async getToken(tokenId) {
        const resources = await this.aptosClient.getAccountResources(tokenId.creator);
        const accountResource = resources.find((r) => r.type === "0x1::token::Collections");
        const tableItemRequest = {
            key_type: "0x1::token::TokenId",
            value_type: "0x1::token::TokenData",
            key: tokenId,
        };
        const token = (await this.aptosClient.getTableItem(accountResource.data.token_data.handle, tableItemRequest)).data;
        return token;
    }
    // returns the collection data of a user
    async getCollection(address, collectionName) {
        const resources = await this.aptosClient.getAccountResources(address);
        const accountResource = resources.find((r) => r.type === "0x1::token::Collections");
        const tableItemRequest = {
            key_type: "0x1::string::String",
            value_type: "0x1::token::Collection",
            key: collectionName,
        };
        const collection = (await this.aptosClient.getTableItem(accountResource.data.collections.handle, tableItemRequest)).data;
        return collection;
    }
    async getCustomResource(address, resourceType, fieldName, keyType, valueType, key) {
        const resources = await this.aptosClient.getAccountResources(address);
        const accountResource = resources.find((r) => r.type === resourceType);
        const tableItemRequest = {
            key_type: keyType,
            value_type: valueType,
            key: key,
        };
        const resource = (await this.aptosClient.getTableItem(accountResource.data[fieldName].handle, tableItemRequest)).data;
        return resource;
    }
    async getAccountResource(accountAddress, resourceType) {
        const response = await (0, cross_fetch_1.default)(`${this.aptosClient.nodeUrl}/accounts/${accountAddress}/resource/${resourceType}`, { method: "GET" });
        if (response.status == 404) {
            return null;
        }
        if (response.status != 200) {
            (0, assert_1.default)(response.status == 200, await response.text());
        }
        return await response.json();
    }
    /**
     * fungible tokens (coins)
     */
    async initializeCoin(account, coin_type_path, // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
    name, symbol, scaling_factor) {
        const payload = {
            type: "script_function_payload",
            function: "0x1::managed_coin::initialize",
            type_arguments: [coin_type_path],
            arguments: [
                buffer_1.Buffer.from(name).toString("hex"),
                buffer_1.Buffer.from(symbol).toString("hex"),
                scaling_factor.toString(),
                false,
            ],
        };
        const txnHash = await this.tokenClient.submitTransactionHelper(account, payload);
        const resp = await this.aptosClient.getTransaction(txnHash);
        const status = { success: resp["success"], vm_status: resp["vm_status"] };
        return { txnHash: txnHash, ...status };
    }
    /** Registers the coin */
    async registerCoin(account, coin_type_path) {
        // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
        const payload = {
            type: "script_function_payload",
            function: "0x1::coin::register",
            type_arguments: [coin_type_path],
            arguments: [],
        };
        const txnHash = await this.tokenClient.submitTransactionHelper(account, payload);
        const resp = await this.aptosClient.getTransaction(txnHash);
        const status = { success: resp["success"], vm_status: resp["vm_status"] };
        return { txnHash: txnHash, ...status };
    }
    /** Mints the coin */
    async mintCoin(account, coin_type_path, // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
    dst_address, amount) {
        const payload = {
            type: "script_function_payload",
            function: "0x1::managed_coin::mint",
            type_arguments: [coin_type_path],
            arguments: [dst_address.toString(), amount.toString()],
        };
        const txnHash = await this.tokenClient.submitTransactionHelper(account, payload);
        const resp = await this.aptosClient.getTransaction(txnHash);
        const status = { success: resp["success"], vm_status: resp["vm_status"] };
        return { txnHash: txnHash, ...status };
    }
    /** Transfers the coins */
    async transferCoin(account, coin_type_path, // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
    to_address, amount) {
        const payload = {
            type: "script_function_payload",
            function: "0x1::coin::transfer",
            type_arguments: [coin_type_path],
            arguments: [to_address.toString(), amount.toString()],
        };
        const txnHash = await this.tokenClient.submitTransactionHelper(account, payload);
        const resp = await this.aptosClient.getTransaction(txnHash);
        const status = { success: resp["success"], vm_status: resp["vm_status"] };
        return { txnHash: txnHash, ...status };
    }
    async getCoinData(coin_type_path) {
        const coin_data = await this.getAccountResource(coin_type_path.split("::")[0], `0x1::coin::CoinInfo<${coin_type_path}>`);
        return coin_data;
    }
    async getCoinBalance(address, coin_type_path) {
        // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
        const coin_info = await this.getAccountResource(address, `0x1::coin::CoinStore<${coin_type_path}>`);
        return Number(coin_info["data"]["coin"]["value"]);
    }
}
exports.WalletClient = WalletClient;
//# sourceMappingURL=wallet_client.js.map