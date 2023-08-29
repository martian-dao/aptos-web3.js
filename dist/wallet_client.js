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
const buffer_1 = require("buffer/");
const bip39 = __importStar(require("@scure/bip39"));
const english = __importStar(require("@scure/bip39/wordlists/english"));
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
const assert_1 = __importDefault(require("assert"));
const transaction_builder_1 = require("./transaction_builder");
const account_1 = require("./account");
const plugins_1 = require("./plugins");
const providers_1 = require("./providers");
const utils_1 = require("./utils");
const aptos_types_1 = require("./aptos_types");
const cache_1 = __importDefault(require("./utils/cache"));
const consts_1 = require("./bcs/consts");
const BCS = __importStar(require("./bcs"));
const COIN_TYPE = 637;
const MAX_ACCOUNTS = 20;
const coinTransferFunction = "0x1::aptos_account::transfer";
const nftTransferFunction = "0x424abce72523e9c02898d3c8eaf9a632f22b7c92ccce2568c4ea47a5c43dfce7::token::transfer_with_opt_in";
class WalletClient {
    constructor(node_url, faucet_url) {
        this.faucetClient = new plugins_1.FaucetClient(node_url, faucet_url);
        this.aptosClient = new providers_1.AptosClient(node_url);
        this.tokenClient = new plugins_1.TokenClient(this.aptosClient);
    }
    async submitTransactionHelper(account, payload, options = { max_gas_amount: "4000" }) {
        try {
            const txnRequest = await this.aptosClient.generateTransaction(account.address(), payload, options);
            const signedTxn = await this.aptosClient.signTransaction(account, txnRequest);
            const res = await this.aptosClient.submitTransaction(signedTxn);
            await this.aptosClient.waitForTransaction(res.hash);
            return await Promise.resolve(res.hash);
        }
        catch (err) {
            return await Promise.reject(err);
        }
    }
    /**
     * Each mnemonic phrase corresponds to a single wallet
     * Wallet can contain multiple accounts
     * An account corresponds to a key pair + address
     *
     * Get all the accounts of a user from their mnemonic phrase
     *
     * @param code The mnemonic phrase (12 word)
     * @returns Wallet object containing all accounts of a user
     */
    async importWallet(code) {
        let address = "";
        let publicKey = "";
        let derivationPath = "";
        const accountsInBc = [];
        const accountMetaData = [];
        for (let i = 0; i < MAX_ACCOUNTS; i += 1) {
            // create derivation path
            derivationPath = `m/44'/${COIN_TYPE}'/${i}'/0'/0'`;
            // get account from derivation path
            const account = account_1.AptosAccount.fromDerivePath(derivationPath, code);
            // assign address and publicKey
            address = utils_1.HexString.ensure(account.address()).toString();
            publicKey = account.pubKey().toString();
            // check if account is present in configured network or not
            /* eslint-disable no-await-in-loop */
            const response = await (0, isomorphic_fetch_1.default)(`${this.aptosClient.nodeUrl}/accounts/${address}`, {
                method: "GET",
            });
            // if not present add account id in list
            if (response.status !== 404) {
                accountsInBc.push(i);
            }
            // push all account in account metadata object
            accountMetaData.push({
                derivationPath,
                address,
                publicKey,
            });
        }
        // if no account is present in blockchain, return 1st account
        if (accountsInBc.length === 0 && accountMetaData.length > 0)
            return { code, accounts: [accountMetaData[0]] };
        // find max of ids
        const maxAccountIdInBc = Math.max(...accountsInBc);
        // return accounts till max id
        return { code, accounts: accountMetaData.slice(0, maxAccountIdInBc + 1) };
    }
    /**
     * Creates a new wallet which contains a single account,
     * which is registered on Aptos
     *
     * @returns A wallet object
     */
    async createWallet() {
        const code = bip39.generateMnemonic(english.wordlist); // mnemonic
        const accountMetadata = await this.createNewAccount(code);
        return { code, accounts: [accountMetadata] };
    }
    /**
     * Creates a new account in the provided wallet
     *
     * @param code mnemonic phrase of the wallet
     * @param index index for the derivation path
     * @returns
     */
    // eslint-disable-next-line class-methods-use-this
    createNewAccount(code, index = 0) {
        if (index > MAX_ACCOUNTS) {
            throw new Error("Max no. of accounts reached");
        }
        const derivationPath = `m/44'/${COIN_TYPE}'/${index}'/0'/0'`;
        const account = account_1.AptosAccount.fromDerivePath(derivationPath, code);
        const address = utils_1.HexString.ensure(account.address()).toString();
        return {
            derivationPath,
            address,
            publicKey: account.pubKey().toString(),
        };
    }
    /** Generates a transaction request that can be submitted to produce a raw transaction that
     * can be signed, which upon being signed can be submitted to the blockchain
     * @param sender Hex-encoded 32 byte Aptos account address of transaction sender
     * @param payload Transaction payload. It depends on transaction type you want to send
     * @param options Options allow to overwrite default transaction options.
     * Defaults are:
     * ```bash
     *   {
     *     sender: senderAddress.hex(),
     *     sequence_number: account.sequence_number,
     *     max_gas_amount: "1000",
     *     gas_unit_price: "1",
     *     // Unix timestamp, in seconds + 10 seconds
     *     expiration_timestamp_secs: (Math.floor(Date.now() / 1000) + 10).toString(),
     *   }
     * ```
     * @returns Serialized form of RawTransaction: Uint8Array
     */
    async generateTransactionSerialized(sender, payload, options) {
        const txnReq = await this.aptosClient.generateTransaction(sender, payload, options);
        const serializer = new BCS.Serializer();
        txnReq.serialize(serializer);
        return serializer.getBytes();
    }
    /**
     * returns an RawTransaction object from serialized bytes
     *
     * @param bytes Buffer
     * @returns RawTransaction Object
     */
    static getTransactionDeserialized(bytes) {
        const deserializer = new BCS.Deserializer(bytes);
        return aptos_types_1.RawTransaction.deserialize(deserializer);
    }
    /**
     * returns an AptosAccount object given a private key and
     * address of the account
     *
     * @param privateKey Private key of an account as a Buffer
     * @param address address of a user
     * @returns AptosAccount object
     */
    static getAccountFromPrivateKey(privateKey, address) {
        return new account_1.AptosAccount(privateKey, address);
    }
    /**
     * returns an AptosAccount at position m/44'/COIN_TYPE'/0'/0/0
     *
     * @param code mnemonic phrase of the wallet
     * @returns AptosAccount object
     */
    static getAccountFromMnemonic(code) {
        return account_1.AptosAccount.fromDerivePath(`m/44'/${COIN_TYPE}'/0'/0'/0'`, code);
    }
    /**
     * returns an AptosAccount object for the desired account
     * using the metadata of the account
     *
     * @param code mnemonic phrase of the wallet
     * @param metaData metadata of the account to be fetched
     * @returns
     */
    static getAccountFromMetaData(code, metaData) {
        return account_1.AptosAccount.fromDerivePath(metaData.derivationPath, code);
    }
    /**
     * airdrops test coins in the given account
     *
     * @param address address of the receiver's account
     * @param amount amount to be airdropped
     * @returns list of transaction hashs
     */
    async airdrop(address, amount) {
        return Promise.resolve(await this.faucetClient.fundAccount(address, amount));
    }
    /**
     * returns the balance of the said account
     *
     * @param address address of the desired account
     * @returns balance of the account
     */
    async getBalance(address) {
        let balance = 0;
        const resources = await this.aptosClient.getAccountResources(address);
        Object.values(resources).forEach((value) => {
            if (value.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>") {
                balance = Number(value.data.coin.value);
            }
        });
        return Promise.resolve(balance);
    }
    /**
     * returns the list of on-chain transactions sent by the said account
     *
     * @param accountAddress address of the desired account
     * @returns list of transactions
     */
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
    /**
     * transfers Aptos Coins from signer to receiver
     *
     * @param account AptosAccount object of the signing account
     * @param recipient_address address of the receiver account
     * @param amount amount of aptos coins to be transferred
     * @returns transaction hash
     */
    async transfer(account, recipient_address, amount) {
        try {
            if (recipient_address.toString() === account.address().toString()) {
                return new Error("cannot transfer coins to self");
            }
            const payload = {
                function: coinTransferFunction,
                type_arguments: [],
                arguments: [recipient_address, amount],
            };
            const rawTxn = await this.aptosClient.generateTransaction(account.address(), payload);
            const signedTxn = await this.aptosClient.signTransaction(account, rawTxn);
            const transaction = await this.aptosClient.submitTransaction(signedTxn);
            await this.aptosClient.waitForTransaction(transaction.hash);
            return await Promise.resolve(transaction.hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * returns the list of events involving transactions
     * starting from the said account
     *
     * @param address address of the desired account
     * @returns list of events
     */
    async getSentEvents(address, limit, start) {
        return Promise.resolve(await this.aptosClient.getAccountTransactions(address, { start, limit }));
    }
    /**
     * returns the list of events involving transactions of Aptos Coins
     * received by the said account
     *
     * @param address address of the desired account
     * @returns list of events
     */
    async getReceivedEvents(address, limit, start) {
        const eventHandleStruct = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";
        return Promise.resolve(await this.aptosClient.getEventsByEventHandle(address, eventHandleStruct, "deposit_events", { start, limit }));
    }
    /**
     * creates an NFT collection
     *
     * @param account AptosAccount object of the signing account
     * @param name collection name
     * @param description collection description
     * @param uri collection URI
     * @returns transaction hash
     */
    async createCollection(account, name, description, uri, maxAmount = consts_1.MAX_U64_BIG_INT, extraArgs) {
        return Promise.resolve(await this.tokenClient.createCollection(account, name, description, uri, maxAmount, extraArgs));
    }
    /**
     * creates an NFT
     *
     * @param account AptosAccount object of the signing account
     * @param collection_name collection name
     * @param name NFT name
     * @param description NFT description
     * @param supply supply for the NFT
     * @param uri NFT URI
     * @param royalty_points_per_million royalty points per million
     * @returns transaction hash
     */
    async createToken(account, collection_name, name, description, supply, uri, max = consts_1.MAX_U64_BIG_INT, royalty_payee_address = account.address(), royalty_points_denominator = 0, royalty_points_numerator = 0, property_keys = [], property_values = [], property_types = [], extraArgs) {
        return Promise.resolve(await this.tokenClient.createToken(account, collection_name, name, description, supply, uri, max, royalty_payee_address, royalty_points_denominator, royalty_points_numerator, property_keys, property_values, property_types, extraArgs));
    }
    /**
     * offers an NFT to another account
     *
     * @param account AptosAccount object of the signing account
     * @param receiver_address address of the receiver account
     * @param creator_address address of the creator account
     * @param collection_name collection name
     * @param token_name NFT name
     * @param amount amount to receive while offering the token
     * @returns transaction hash
     */
    async offerToken(account, receiver_address, creator_address, collection_name, token_name, amount, property_version = 0, extraArgs) {
        return Promise.resolve(await this.tokenClient.offerToken(account, receiver_address, creator_address, collection_name, token_name, amount, property_version, extraArgs));
    }
    /**
     * cancels an NFT offer
     *
     * @param account AptosAccount of the signing account
     * @param receiver_address address of the receiver account
     * @param creator_address address of the creator account
     * @param collection_name collection name
     * @param token_name NFT name
     * @returns transaction hash
     */
    async cancelTokenOffer(account, receiver_address, creator_address, collection_name, token_name, property_version = 0, extraArgs) {
        return Promise.resolve(await this.tokenClient.cancelTokenOffer(account, receiver_address, creator_address, collection_name, token_name, property_version, extraArgs));
    }
    /**
     * claims offered NFT
     *
     * @param account AptosAccount of the signing account
     * @param sender_address address of the sender account
     * @param creator_address address of the creator account
     * @param collection_name collection name
     * @param token_name NFT name
     * @returns transaction hash
     */
    async claimToken(account, sender_address, creator_address, collection_name, token_name, property_version = 0, extraArgs) {
        return Promise.resolve(await this.tokenClient.claimToken(account, sender_address, creator_address, collection_name, token_name, property_version, extraArgs));
    }
    /**
     * Opt in to receive nft transfers from other accounts
     *
     * @param account AptosAccount which has to opt in for receiving nft transfers
     * @param opt_in Boolean value of whether to opt in or not
     * @returns The hash of the transaction submitted to the API
     */
    async optInDirectTransfer(account, opt_in) {
        try {
            const payload = {
                function: "0x3::token::opt_in_direct_transfer",
                type_arguments: [],
                arguments: [opt_in],
            };
            const rawTxn = await this.aptosClient.generateTransaction(account.address(), payload);
            const signedTxn = await this.aptosClient.signTransaction(account, rawTxn);
            const transaction = await this.aptosClient.submitTransaction(signedTxn);
            await this.aptosClient.waitForTransaction(transaction.hash);
            return await Promise.resolve(transaction.hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Transfer the specified amount of tokens from account to receiver
     * Receiver must have opted in for direct transfers
     *
     * @param sender AptosAccount where token from which tokens will be transfered
     * @param receiver Hex-encoded 32 byte Aptos account address to which tokens will be transfered
     * @param creator Hex-encoded 32 byte Aptos account address to which created tokens
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param amount Amount of tokens which will be transfered
     * @param propertyVersion the version of token PropertyMap with a default value 0.
     * @returns The hash of the transaction submitted to the API
     */
    async transferWithOptIn(sender, receiver, creator, collectionName, name, amount, propertyVersion = 0) {
        try {
            const payload = {
                function: nftTransferFunction,
                type_arguments: [],
                arguments: [
                    creator,
                    collectionName,
                    name,
                    propertyVersion,
                    receiver,
                    amount,
                ],
            };
            const rawTxn = await this.aptosClient.generateTransaction(sender.address(), payload);
            const signedTxn = await this.aptosClient.signTransaction(sender, rawTxn);
            const transaction = await this.aptosClient.submitTransaction(signedTxn);
            await this.aptosClient.waitForTransaction(transaction.hash);
            return await Promise.resolve(transaction.hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * sign a generic transaction
     *
     * @param account AptosAccount of the signing account
     * @param func function name to be called
     * @param args arguments of the function to be called
     * @param type_args type arguments of the function to be called
     * @returns transaction hash
     */
    async signGenericTransaction(account, func, args, type_args) {
        const payload = {
            type: "entry_function_payload",
            function: func,
            type_arguments: type_args,
            arguments: args,
        };
        const txnHash = await this.submitTransactionHelper(account, payload);
        const resp = await this.aptosClient.getTransactionByHash(txnHash);
        const status = { success: resp.success, vm_status: resp.vm_status };
        return { txnHash, ...status };
    }
    static async getSigningMessage(txnRequest) {
        return transaction_builder_1.TransactionBuilder.getSigningMessage(txnRequest);
    }
    async signAndSubmitTransaction(account, txnRequest) {
        const signedTxn = await this.aptosClient.signTransaction(account, txnRequest);
        const res = await this.aptosClient.submitTransaction(signedTxn);
        await this.aptosClient.waitForTransaction(res.hash);
        return Promise.resolve(res.hash);
    }
    // sign and submit multiple transactions
    async signAndSubmitTransactions(account, txnRequests) {
        const hashs = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const rawTxn of txnRequests) {
            /* eslint-disable no-await-in-loop */
            try {
                const txnRequest = await this.aptosClient.generateTransaction(rawTxn.sender, rawTxn.payload, rawTxn.options);
                const signedTxn = await this.aptosClient.signTransaction(account, txnRequest);
                const res = await this.aptosClient.submitTransaction(signedTxn);
                await this.aptosClient.waitForTransaction(res.hash);
                hashs.push(res.hash);
            }
            catch (err) {
                hashs.push(err.message);
            }
            /* eslint-enable no-await-in-loop */
        }
        return Promise.resolve(hashs);
    }
    async signTransaction(account, txnRequest) {
        return Promise.resolve(await this.aptosClient.signTransaction(account, txnRequest));
    }
    async estimateGasFees(accountPublicKey, transaction) {
        const simulateResponse = await this.aptosClient.simulateTransaction(accountPublicKey, transaction);
        return (parseInt(simulateResponse[0].gas_used, 10) *
            parseInt(simulateResponse[0].gas_unit_price, 10)).toString();
    }
    async getTransactionChanges(accountPublicKey, transaction) {
        const simulateResponse = await this.aptosClient.simulateTransaction(accountPublicKey, transaction);
        const txnData = simulateResponse[0];
        return {
            changes: txnData.changes,
            events: txnData.events,
            gas: parseInt(txnData.gas_used, 10) * parseInt(txnData.gas_unit_price, 10),
            payload: txnData.payload,
            success: txnData.success,
            vm_status: txnData.vm_status,
        };
    }
    async estimateCost(accountAddress, accountPublicKey, transaction) {
        const simulateResponse = await this.aptosClient.simulateTransaction(accountPublicKey, transaction);
        const txnData = simulateResponse[0];
        const currentBalance = await this.getBalance(accountAddress);
        const change = txnData.changes.filter((ch) => {
            if (ch.type !== "write_resource") {
                return false;
            }
            const write = ch;
            if (write.data.type ===
                "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>" &&
                (write.address === accountAddress.toString() ||
                    write.address === utils_1.HexString.ensure(accountAddress).toShortString())) {
                return true;
            }
            return false;
        });
        if (change.length > 0) {
            /* eslint-disable @typescript-eslint/dot-notation */
            return (currentBalance -
                parseInt(change[0]["data"].data["coin"].value, 10) -
                parseInt(txnData.gas_used, 10) * parseInt(txnData.gas_unit_price, 10)).toString();
        }
        return "0";
    }
    async submitTransaction(signedTxn) {
        return Promise.resolve(await this.aptosClient.submitTransaction(signedTxn));
    }
    static generateBCSTransaction(account, rawTxn) {
        return Promise.resolve(providers_1.AptosClient.generateBCSTransaction(account, rawTxn));
    }
    static generateBCSSimulation(account, rawTxn) {
        return Promise.resolve(providers_1.AptosClient.generateBCSSimulation(account, rawTxn));
    }
    async submitSignedBCSTransaction(signedTxn) {
        return Promise.resolve(await this.aptosClient.submitSignedBCSTransaction(signedTxn));
    }
    async submitBCSSimulation(bcsBody) {
        return Promise.resolve(await this.aptosClient.submitBCSSimulation(bcsBody));
    }
    static signMessage(account, message) {
        return Promise.resolve(account.signBuffer(buffer_1.Buffer.from(message)).hex());
    }
    /**
     * Rotates the auth key
     * Disabled
     *
     * @param code mnemonic phrase for the desired wallet
     * @param metaData metadata for the desired account
     * @returns status object
     */
    /* eslint-disable */
    async rotateAuthKey(code, metaData) {
        // const account: AptosAccount = await WalletClient.getAccountFromMetaData(
        //   code,
        //   metaData
        // );
        // const pathSplit = metaData.derivationPath.split("/");
        // const addressIndex = Number(pathSplit[pathSplit.length - 1].slice(0, -1));
        // if (addressIndex >= ADDRESS_GAP - 1) {
        //   throw new Error("Maximum key rotation reached");
        // }
        // const newDerivationPath = `${pathSplit
        //   .slice(0, pathSplit.length - 1)
        //   .join("/")}/${addressIndex + 1}'`;
        // const newAccount = await WalletClient.getAccountFromMetaData(code, {
        //   address: metaData.address,
        //   derivationPath: newDerivationPath,
        // });
        // const newAuthKey = newAccount.authKey().noPrefix();
        // const transactionStatus = await this.signGenericTransaction(
        //   account,
        //   "0x1::account::rotate_authentication_key_25519",
        //   [account.pubKey().toString(), account.],
        //   []
        // );
        // if (!transactionStatus.success) {
        //   return {
        //     authkey: "",
        //     success: false,
        //     vm_status: transactionStatus.vm_status,
        //   };
        // }
        return {
            authkey: "0x",
            success: false,
            vm_status: "disabled",
        };
    }
    /* eslint-enable */
    async getEventStream(address, eventHandleStruct, fieldName, limit, start) {
        let endpointUrl = `${this.aptosClient.nodeUrl}/accounts/${address}/events/${eventHandleStruct}/${fieldName}`;
        if (limit) {
            endpointUrl += `?limit=${limit}`;
        }
        if (start) {
            endpointUrl += limit ? `&start=${start}` : `?start=${start}`;
        }
        const response = await (0, isomorphic_fetch_1.default)(endpointUrl, {
            method: "GET",
        });
        if (response.status === 404) {
            return [];
        }
        return Promise.resolve(await response.json());
    }
    /**
     *
     * @param address address of the desired account
     * @returns {boolean} true if user registered for direct transfer else false
     */
    async getTokenDirectTransferStatus(address) {
        try {
            const accountResources = await this.aptosClient.getAccountResources(address);
            const tokenStore = accountResources.filter((value) => value.type === "0x3::token::TokenStore");
            if (!tokenStore || tokenStore.length === 0)
                return false;
            const { data } = tokenStore[0];
            return data.direct_transfer;
        }
        catch (err) {
            // incase of account which is not registered in the blockchain
            return false;
        }
    }
    /**
     * returns the account resources of type "0x3::token::TokenStore"
     *
     * @param address address of the desired account
     * @returns tokenStore Resources
     */
    async getTokenStoreResources(address) {
        const tokenStoreResources = await this.aptosClient.getAccountResource(address, "0x3::token::TokenStore");
        return tokenStoreResources;
    }
    /**
     * returns a list of token IDs of the tokens in a user's account
     * (including the tokens that were minted)
     *
     * @param address address of the desired account
     * @returns list of token IDs
     */
    async getTokenIds(address, limit, depositStart, withdrawStart) {
        const countDeposit = {};
        const countWithdraw = {};
        const elementsFetched = new Set();
        const tokenIds = [];
        const depositEvents = await this.getEventStream(address, "0x3::token::TokenStore", "deposit_events", limit, depositStart);
        const withdrawEvents = await this.getEventStream(address, "0x3::token::TokenStore", "withdraw_events", limit, withdrawStart);
        let maxDepositSequenceNumber = -1;
        let maxWithdrawSequenceNumber = -1;
        depositEvents.forEach((element) => {
            const elementString = JSON.stringify(element.data.id);
            elementsFetched.add(elementString);
            countDeposit[elementString] = countDeposit[elementString]
                ? {
                    count: countDeposit[elementString].count + 1,
                    sequence_number: element.sequence_number,
                    data: element.data.id,
                }
                : {
                    count: 1,
                    sequence_number: element.sequence_number,
                    data: element.data.id,
                };
            maxDepositSequenceNumber = Math.max(maxDepositSequenceNumber, parseInt(element.sequence_number, 10));
        });
        withdrawEvents.forEach((element) => {
            const elementString = JSON.stringify(element.data.id);
            elementsFetched.add(elementString);
            countWithdraw[elementString] = countWithdraw[elementString]
                ? {
                    count: countWithdraw[elementString].count + 1,
                    sequence_number: element.sequence_number,
                    data: element.data.id,
                }
                : {
                    count: 1,
                    sequence_number: element.sequence_number,
                    data: element.data.id,
                };
            maxWithdrawSequenceNumber = Math.max(maxWithdrawSequenceNumber, parseInt(element.sequence_number, 10));
        });
        if (elementsFetched) {
            Array.from(elementsFetched).forEach((elementString) => {
                const depositEventCount = countDeposit[elementString]
                    ? countDeposit[elementString].count
                    : 0;
                const withdrawEventCount = countWithdraw[elementString]
                    ? countWithdraw[elementString].count
                    : 0;
                tokenIds.push({
                    data: countDeposit[elementString]
                        ? countDeposit[elementString].data
                        : countWithdraw[elementString].data,
                    deposit_sequence_number: countDeposit[elementString]
                        ? countDeposit[elementString].sequence_number
                        : "-1",
                    withdraw_sequence_number: countWithdraw[elementString]
                        ? countWithdraw[elementString].sequence_number
                        : "-1",
                    difference: depositEventCount - withdrawEventCount,
                });
            });
        }
        return { tokenIds, maxDepositSequenceNumber, maxWithdrawSequenceNumber };
    }
    /**
     * returns the tokens in an account
     *
     * @param address address of the desired account
     * @returns list of tokens and their collection data
     */
    async getTokens(address, limit, depositStart, withdrawStart) {
        const { tokenIds } = await this.getTokenIds(address, limit, depositStart, withdrawStart);
        const tokens = [];
        await Promise.all(tokenIds.map(async (tokenId) => {
            try {
                let resources;
                if (cache_1.default.has(`resources--${tokenId.data.token_data_id.creator}`)) {
                    resources = cache_1.default.get(`resources--${tokenId.data.token_data_id.creator}`);
                }
                else {
                    resources = await this.aptosClient.getAccountResources(tokenId.data.token_data_id.creator);
                    cache_1.default.set(`resources--${tokenId.data.token_data_id.creator}`, resources);
                }
                const accountResource = resources.find((r) => r.type === "0x3::token::Collections");
                const tableItemRequest = {
                    key_type: "0x3::token::TokenDataId",
                    value_type: "0x3::token::TokenData",
                    key: tokenId.data.token_data_id,
                };
                const cacheKey = JSON.stringify(tableItemRequest);
                let token;
                if (cache_1.default.has(cacheKey)) {
                    token = cache_1.default.get(cacheKey);
                }
                else {
                    token = await this.aptosClient.getTableItem(accountResource.data.token_data.handle, tableItemRequest);
                    cache_1.default.set(cacheKey, token);
                }
                token.collection = tokenId.data.token_data_id.collection;
                tokens.push({ token, sequence_number: tokenId.sequence_number });
            }
            catch (e) {
                // Errors happening because of token handle not found will lead here
            }
        }));
        return tokens;
    }
    /**
     * returns the token information (including the collection information)
     * about a said tokenID
     *
     * @param tokenId token ID of the desired token
     * @returns token information
     */
    async getToken(tokenId, resourceHandle) {
        let accountResource;
        if (!resourceHandle) {
            const resources = await this.aptosClient.getAccountResources(tokenId.token_data_id.creator);
            accountResource = resources.find((r) => r.type === "0x3::token::Collections");
        }
        const tableItemRequest = {
            key_type: "0x3::token::TokenDataId",
            value_type: "0x3::token::TokenData",
            key: tokenId.token_data_id,
        };
        const token = await this.aptosClient.getTableItem(resourceHandle || accountResource.data.token_data.handle, tableItemRequest);
        token.collection = tokenId.token_data_id.collection;
        return token;
    }
    async getTokenProperties(tokenId, address) {
        const resources = await this.aptosClient.getAccountResources(address);
        const accountResource = resources.find((r) => r.type === "0x3::token::TokenStore");
        const tableItemRequestForPropertiesData = {
            key_type: "0x3::token::TokenId",
            value_type: "0x3::token::Token",
            key: tokenId,
        };
        const tokenPropertiesData = await this.aptosClient.getTableItem(accountResource.data.tokens.handle, tableItemRequestForPropertiesData);
        return tokenPropertiesData;
    }
    /**
     * returns the resource handle for type 0x3::token::Collections
     * about a said creator
     *
     * @param tokenId token ID of the desired token
     * @returns resource information
     */
    async getTokenResourceHandle(tokenId) {
        const resources = await this.aptosClient.getAccountResources(tokenId.token_data_id.creator);
        const accountResource = resources.find((r) => r.type === "0x3::token::Collections");
        return accountResource.data.token_data.handle;
    }
    /**
     * returns the information about a collection of an account
     *
     * @param address address of the desired account
     * @param collectionName collection name
     * @returns collection information
     */
    async getCollection(address, collectionName) {
        const resources = await this.aptosClient.getAccountResources(address);
        const accountResource = resources.find((r) => r.type === "0x3::token::Collections");
        const tableItemRequest = {
            key_type: "0x1::string::String",
            value_type: "0x3::token::Collection",
            key: collectionName,
        };
        const collection = await this.aptosClient.getTableItem(accountResource.data.collections.handle, tableItemRequest);
        return collection;
    }
    async getCustomResource(address, resourceType, fieldName, keyType, valueType, key) {
        const resources = await this.aptosClient.getAccountResources(address);
        const accountResource = resources.find((r) => r.type === resourceType);
        const tableItemRequest = {
            key_type: keyType,
            value_type: valueType,
            key,
        };
        const resource = await this.aptosClient.getTableItem(accountResource.data[fieldName].handle, tableItemRequest);
        return resource;
    }
    /**
     * returns info about a particular resource inside an account
     *
     * @param accountAddress address of the desired account
     * @param resourceType type of the desired resource
     * @returns resource information
     */
    async getAccountResource(accountAddress, resourceType) {
        const response = await (0, isomorphic_fetch_1.default)(`${this.aptosClient.nodeUrl}/accounts/${accountAddress}/resource/${resourceType}`, { method: "GET" });
        if (response.status === 404) {
            return null;
        }
        if (response.status !== 200) {
            (0, assert_1.default)(response.status === 200, await response.text());
        }
        return Promise.resolve(await response.json());
    }
    /**
     * initializes a coin
     *
     * precondition: a module of the desired coin has to be deployed in the signer's account
     *
     * @param account AptosAccount object of the signing account
     * @param coin_type_path address path of the desired coin
     * @param name name of the coin
     * @param symbol symbol of the coin
     * @param scaling_factor scaling factor of the coin
     * @returns transaction hash
     */
    async initializeCoin(account, coin_type_path, // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
    name, symbol, scaling_factor) {
        const payload = {
            type: "entry_function_payload",
            function: "0x1::managed_coin::initialize",
            type_arguments: [coin_type_path],
            arguments: [name, symbol, scaling_factor, false],
        };
        const txnHash = await this.submitTransactionHelper(account, payload);
        const resp = await this.aptosClient.getTransactionByHash(txnHash);
        const status = { success: resp.success, vm_status: resp.vm_status };
        return { txnHash, ...status };
    }
    /**
     * registers a coin for an account
     *
     * creates the resource for the desired account such that
     * the account can start transacting in the desired coin
     *
     * @param account AptosAccount object of the signing account
     * @param coin_type_path address path of the desired coin
     * @returns transaction hash
     */
    async registerCoin(account, coin_type_path) {
        const token = new transaction_builder_1.TxnBuilderTypes.TypeTagStruct(transaction_builder_1.TxnBuilderTypes.StructTag.fromString(coin_type_path));
        const entryFunctionPayload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadEntryFunction(transaction_builder_1.TxnBuilderTypes.EntryFunction.natural("0x1::managed_coin", "register", [token], []));
        const rawTxn = await this.aptosClient.generateRawTransaction(account.address(), entryFunctionPayload);
        const bcsTxn = providers_1.AptosClient.generateBCSTransaction(account, rawTxn);
        const transactionRes = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
        await this.aptosClient.waitForTransaction(transactionRes.hash);
        const resp = await this.aptosClient.getTransactionByHash(transactionRes.hash);
        const status = { success: resp.success, vm_status: resp.vm_status };
        const txnHash = transactionRes.hash;
        return { txnHash, ...status };
    }
    /**
     * mints a coin in a receiver account
     *
     * precondition: the signer should have minting capability
     * unless specifically granted, only the account where the module
     * of the desired coin lies has the minting capability
     *
     * @param account AptosAccount object of the signing account
     * @param coin_type_path address path of the desired coin
     * @param dst_address address of the receiver account
     * @param amount amount to be minted
     * @returns transaction hash
     */
    async mintCoin(account, coin_type_path, // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
    dst_address, amount) {
        const token = new transaction_builder_1.TxnBuilderTypes.TypeTagStruct(transaction_builder_1.TxnBuilderTypes.StructTag.fromString(coin_type_path));
        const entryFunctionPayload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadEntryFunction(transaction_builder_1.TxnBuilderTypes.EntryFunction.natural("0x1::managed_coin", "mint", [token], [
            BCS.bcsToBytes(transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(utils_1.HexString.ensure(dst_address).toString())),
            BCS.bcsSerializeUint64(amount),
        ]));
        const rawTxn = await this.aptosClient.generateRawTransaction(account.address(), entryFunctionPayload);
        const bcsTxn = providers_1.AptosClient.generateBCSTransaction(account, rawTxn);
        const transactionRes = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
        await this.aptosClient.waitForTransaction(transactionRes.hash);
        const resp = await this.aptosClient.getTransactionByHash(transactionRes.hash);
        const status = { success: resp.success, vm_status: resp.vm_status };
        const txnHash = transactionRes.hash;
        return { txnHash, ...status };
    }
    /**
     * transfers coin (applicable for all altcoins on Aptos) to receiver account
     *
     * @param account AptosAccount object of the signing account
     * @param coin_type_path address path of the desired coin
     * @param to_address address of the receiver account
     * @param amount amount to be transferred
     * @returns transaction hash
     */
    async transferCoin(account, coin_type_path, // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
    to_address, amount) {
        const token = new transaction_builder_1.TxnBuilderTypes.TypeTagStruct(transaction_builder_1.TxnBuilderTypes.StructTag.fromString(coin_type_path));
        const entryFunctionPayload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadEntryFunction(transaction_builder_1.TxnBuilderTypes.EntryFunction.natural("0x1::coin", "transfer", [token], [
            BCS.bcsToBytes(transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(utils_1.HexString.ensure(to_address).toString())),
            BCS.bcsSerializeUint64(amount),
        ]));
        const rawTxn = await this.aptosClient.generateRawTransaction(account.address(), entryFunctionPayload);
        const bcsTxn = providers_1.AptosClient.generateBCSTransaction(account, rawTxn);
        const transactionRes = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
        await this.aptosClient.waitForTransaction(transactionRes.hash);
        const resp = await this.aptosClient.getTransactionByHash(transactionRes.hash);
        const status = { success: resp.success, vm_status: resp.vm_status };
        const txnHash = transactionRes.hash;
        return { txnHash, ...status };
    }
    /**
     * returns the information about the coin
     *
     * @param coin_type_path address path of the desired coin
     * @returns coin information
     */
    async getCoinData(coin_type_path) {
        const coinData = await this.getAccountResource(coin_type_path.split("::")[0], `0x1::coin::CoinInfo<${coin_type_path}>`);
        return coinData;
    }
    /**
     * returns the balance of the coin for an account
     *
     * @param address address of the desired account
     * @param coin_type_path address path of the desired coin
     * @returns number of coins
     */
    async getCoinBalance(address, coin_type_path) {
        // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
        const coinInfo = await this.getAccountResource(address, `0x1::coin::CoinStore<${coin_type_path}>`);
        return Number(coinInfo ? coinInfo.data.coin.value : 0);
    }
    /**
     * returns the list of all the custom coins for an account
     *
     * @param address address of the desired account
     * @returns array of coins with their data
     */
    async getCustomCoins(address) {
        const coins = [];
        const resources = await this.aptosClient.getAccountResources(address);
        await Promise.all(Object.values(resources).map(async (value) => {
            if (value.type.startsWith("0x1::coin::CoinStore") &&
                value.type !== "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>") {
                const coinTypePath = value.type.substring(value.type.indexOf("<") + 1, value.type.lastIndexOf(">"));
                const coinData = await this.getCoinData(coinTypePath);
                coins.push({
                    balance: Number(value.data.coin.value),
                    name: coinData.data.symbol,
                    decimals: coinData.data.decimals,
                    coinName: coinData.data.name,
                    coinAddress: coinTypePath,
                });
            }
        }));
        return coins;
    }
    async publishModule(sender, packageMetadataHex, moduleHex, extraArgs) {
        const txnHash = await this.aptosClient.publishPackage(sender, new utils_1.HexString(packageMetadataHex).toUint8Array(), [new transaction_builder_1.TxnBuilderTypes.Module(new utils_1.HexString(moduleHex).toUint8Array())], extraArgs);
        return txnHash;
    }
}
exports.WalletClient = WalletClient;
//# sourceMappingURL=wallet_client.js.map