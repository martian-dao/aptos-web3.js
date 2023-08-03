import { Buffer } from "buffer/";
import { TxnBuilderTypes } from "./transaction_builder";
import { AptosAccount } from "./account";
import { TokenClient, FaucetClient } from "./plugins";
import { AptosClient, OptionalTransactionArgs } from "./providers";
import { HexString, MaybeHexString } from "./utils";
import { RawTransaction } from "./aptos_types";
import * as BCS from "./bcs";
import * as Gen from "./generated/index";
import { AnyNumber } from "./bcs";
export interface TxnRequestRaw {
    sender: MaybeHexString;
    payload: Gen.EntryFunctionPayload;
    options?: Partial<Gen.SubmitTransactionRequest>;
}
export interface TokenId {
    property_version: string;
    token_data_id: {
        creator: string;
        collection: string;
        name: string;
    };
}
export interface AccountMetaData {
    derivationPath: string;
    address: string;
    publicKey?: string;
}
export interface Wallet {
    code: string;
    accounts: AccountMetaData[];
}
export declare class WalletClient {
    faucetClient: FaucetClient;
    aptosClient: AptosClient;
    tokenClient: TokenClient;
    constructor(node_url: any, faucet_url: any);
    submitTransactionHelper(account: AptosAccount, payload: Gen.EntryFunctionPayload, options?: {
        max_gas_amount: string;
    }): Promise<string>;
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
    importWallet(code: string): Promise<Wallet>;
    /**
     * Creates a new wallet which contains a single account,
     * which is registered on Aptos
     *
     * @returns A wallet object
     */
    createWallet(): Promise<Wallet>;
    /**
     * Creates a new account in the provided wallet
     *
     * @param code mnemonic phrase of the wallet
     * @param index index for the derivation path
     * @returns
     */
    createNewAccount(code: string, index?: number): AccountMetaData;
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
    generateTransactionSerialized(sender: MaybeHexString, payload: Gen.EntryFunctionPayload, options?: Partial<Gen.SubmitTransactionRequest>): Promise<Uint8Array>;
    /**
     * returns an RawTransaction object from serialized bytes
     *
     * @param bytes Buffer
     * @returns RawTransaction Object
     */
    static getTransactionDeserialized(bytes: Uint8Array): TxnBuilderTypes.RawTransaction;
    /**
     * returns an AptosAccount object given a private key and
     * address of the account
     *
     * @param privateKey Private key of an account as a Buffer
     * @param address address of a user
     * @returns AptosAccount object
     */
    static getAccountFromPrivateKey(privateKey: Buffer, address?: string): AptosAccount;
    /**
     * returns an AptosAccount at position m/44'/COIN_TYPE'/0'/0/0
     *
     * @param code mnemonic phrase of the wallet
     * @returns AptosAccount object
     */
    static getAccountFromMnemonic(code: string): AptosAccount;
    /**
     * returns an AptosAccount object for the desired account
     * using the metadata of the account
     *
     * @param code mnemonic phrase of the wallet
     * @param metaData metadata of the account to be fetched
     * @returns
     */
    static getAccountFromMetaData(code: string, metaData: AccountMetaData): AptosAccount;
    /**
     * airdrops test coins in the given account
     *
     * @param address address of the receiver's account
     * @param amount amount to be airdropped
     * @returns list of transaction hashs
     */
    airdrop(address: string, amount: number): Promise<string[]>;
    /**
     * returns the balance of the said account
     *
     * @param address address of the desired account
     * @returns balance of the account
     */
    getBalance(address: string | HexString): Promise<number>;
    /**
     * returns the list of on-chain transactions sent by the said account
     *
     * @param accountAddress address of the desired account
     * @returns list of transactions
     */
    accountTransactions(accountAddress: MaybeHexString): Promise<{
        data: any;
        from: any;
        gas: any;
        gasPrice: any;
        hash: any;
        success: any;
        timestamp: any;
        toAddress: any;
        price: any;
        type: any;
        version: any;
        vmStatus: any;
    }[]>;
    /**
     * transfers Aptos Coins from signer to receiver
     *
     * @param account AptosAccount object of the signing account
     * @param recipient_address address of the receiver account
     * @param amount amount of aptos coins to be transferred
     * @returns transaction hash
     */
    transfer(account: AptosAccount, recipient_address: string | HexString, amount: number): Promise<string | Error>;
    /**
     * returns the list of events involving transactions
     * starting from the said account
     *
     * @param address address of the desired account
     * @returns list of events
     */
    getSentEvents(address: MaybeHexString, limit?: number, start?: AnyNumber): Promise<Gen.Transaction[]>;
    /**
     * returns the list of events involving transactions of Aptos Coins
     * received by the said account
     *
     * @param address address of the desired account
     * @returns list of events
     */
    getReceivedEvents(address: string, limit?: number, start?: AnyNumber): Promise<Gen.Event[]>;
    /**
     * creates an NFT collection
     *
     * @param account AptosAccount object of the signing account
     * @param name collection name
     * @param description collection description
     * @param uri collection URI
     * @returns transaction hash
     */
    createCollection(account: AptosAccount, name: string, description: string, uri: string, maxAmount?: AnyNumber, extraArgs?: OptionalTransactionArgs): Promise<string>;
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
    createToken(account: AptosAccount, collection_name: string, name: string, description: string, supply: number, uri: string, max?: BCS.AnyNumber, royalty_payee_address?: MaybeHexString, royalty_points_denominator?: number, royalty_points_numerator?: number, property_keys?: Array<string>, property_values?: Array<string>, property_types?: Array<string>, extraArgs?: OptionalTransactionArgs): Promise<string>;
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
    offerToken(account: AptosAccount, receiver_address: string, creator_address: string, collection_name: string, token_name: string, amount: number, property_version?: number, extraArgs?: OptionalTransactionArgs): Promise<string>;
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
    cancelTokenOffer(account: AptosAccount, receiver_address: string, creator_address: string, collection_name: string, token_name: string, property_version?: number, extraArgs?: OptionalTransactionArgs): Promise<string>;
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
    claimToken(account: AptosAccount, sender_address: string, creator_address: string, collection_name: string, token_name: string, property_version?: number, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Opt in to receive nft transfers from other accounts
     *
     * @param account AptosAccount which has to opt in for receiving nft transfers
     * @param opt_in Boolean value of whether to opt in or not
     * @returns The hash of the transaction submitted to the API
     */
    optInDirectTransfer(account: AptosAccount, opt_in: Boolean): Promise<string>;
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
    transferWithOptIn(sender: AptosAccount, receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, amount: number, propertyVersion?: number): Promise<string>;
    /**
     * sign a generic transaction
     *
     * @param account AptosAccount of the signing account
     * @param func function name to be called
     * @param args arguments of the function to be called
     * @param type_args type arguments of the function to be called
     * @returns transaction hash
     */
    signGenericTransaction(account: AptosAccount, func: string, args: string[], type_args: string[]): Promise<{
        success: any;
        vm_status: any;
        txnHash: string;
    }>;
    static getSigningMessage(txnRequest: TxnBuilderTypes.RawTransaction): Promise<Uint8Array>;
    signAndSubmitTransaction(account: AptosAccount, txnRequest: TxnBuilderTypes.RawTransaction): Promise<string>;
    signAndSubmitTransactions(account: AptosAccount, txnRequests: TxnRequestRaw[]): Promise<any[]>;
    signTransaction(account: AptosAccount, txnRequest: TxnBuilderTypes.RawTransaction): Promise<Uint8Array>;
    estimateGasFees(accountPublicKey: MaybeHexString, transaction: TxnBuilderTypes.RawTransaction): Promise<string>;
    getTransactionChanges(accountPublicKey: MaybeHexString, transaction: TxnBuilderTypes.RawTransaction): Promise<Object>;
    estimateCost(accountAddress: MaybeHexString, accountPublicKey: MaybeHexString, transaction: TxnBuilderTypes.RawTransaction): Promise<string>;
    submitTransaction(signedTxn: Uint8Array): Promise<Gen.PendingTransaction>;
    static generateBCSTransaction(account: AptosAccount, rawTxn: RawTransaction): Promise<Uint8Array>;
    static generateBCSSimulation(account: AptosAccount, rawTxn: RawTransaction): Promise<Uint8Array>;
    submitSignedBCSTransaction(signedTxn: Uint8Array): Promise<Gen.PendingTransaction>;
    submitBCSSimulation(bcsBody: Uint8Array): Promise<Gen.UserTransaction[]>;
    static signMessage(account: AptosAccount, message: string): Promise<string>;
    /**
     * Rotates the auth key
     * Disabled
     *
     * @param code mnemonic phrase for the desired wallet
     * @param metaData metadata for the desired account
     * @returns status object
     */
    rotateAuthKey(code: string, metaData: AccountMetaData): Promise<{
        authkey: string;
        success: boolean;
        vm_status: string;
    }>;
    getEventStream(address: string, eventHandleStruct: string, fieldName: string, limit?: number, start?: number): Promise<any>;
    /**
     *
     * @param address address of the desired account
     * @returns {boolean} true if user registered for direct transfer else false
     */
    getTokenDirectTransferStatus(address: string): Promise<any>;
    /**
     * returns the account resources of type "0x3::token::TokenStore"
     *
     * @param address address of the desired account
     * @returns tokenStore Resources
     */
    getTokenStoreResources(address: string): Promise<Gen.MoveResource>;
    /**
     * returns a list of token IDs of the tokens in a user's account
     * (including the tokens that were minted)
     *
     * @param address address of the desired account
     * @returns list of token IDs
     */
    getTokenIds(address: string, limit?: number, depositStart?: number, withdrawStart?: number): Promise<{
        tokenIds: any[];
        maxDepositSequenceNumber: number;
        maxWithdrawSequenceNumber: number;
    }>;
    /**
     * returns the tokens in an account
     *
     * @param address address of the desired account
     * @returns list of tokens and their collection data
     */
    getTokens(address: string, limit?: number, depositStart?: number, withdrawStart?: number): Promise<any[]>;
    /**
     * returns the token information (including the collection information)
     * about a said tokenID
     *
     * @param tokenId token ID of the desired token
     * @returns token information
     */
    getToken(tokenId: TokenId, resourceHandle?: string): Promise<any>;
    getTokenProperties(tokenId: TokenId, address: string): Promise<any>;
    /**
     * returns the resource handle for type 0x3::token::Collections
     * about a said creator
     *
     * @param tokenId token ID of the desired token
     * @returns resource information
     */
    getTokenResourceHandle(tokenId: TokenId): Promise<any>;
    /**
     * returns the information about a collection of an account
     *
     * @param address address of the desired account
     * @param collectionName collection name
     * @returns collection information
     */
    getCollection(address: string, collectionName: string): Promise<any>;
    getCustomResource(address: string, resourceType: string, fieldName: string, keyType: string, valueType: string, key: any): Promise<any>;
    /**
     * returns info about a particular resource inside an account
     *
     * @param accountAddress address of the desired account
     * @param resourceType type of the desired resource
     * @returns resource information
     */
    getAccountResource(accountAddress: string, resourceType: string): Promise<any>;
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
    initializeCoin(account: AptosAccount, coin_type_path: string, // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
    name: string, symbol: string, scaling_factor: number): Promise<{
        success: any;
        vm_status: any;
        txnHash: string;
    }>;
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
    registerCoin(account: AptosAccount, coin_type_path: string): Promise<{
        success: any;
        vm_status: any;
        txnHash: string;
    }>;
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
    mintCoin(account: AptosAccount, coin_type_path: string, // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
    dst_address: string, amount: number): Promise<{
        success: any;
        vm_status: any;
        txnHash: string;
    }>;
    /**
     * transfers coin (applicable for all altcoins on Aptos) to receiver account
     *
     * @param account AptosAccount object of the signing account
     * @param coin_type_path address path of the desired coin
     * @param to_address address of the receiver account
     * @param amount amount to be transferred
     * @returns transaction hash
     */
    transferCoin(account: AptosAccount, coin_type_path: string, // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
    to_address: string, amount: number): Promise<{
        success: any;
        vm_status: any;
        txnHash: string;
    }>;
    /**
     * returns the information about the coin
     *
     * @param coin_type_path address path of the desired coin
     * @returns coin information
     */
    getCoinData(coin_type_path: string): Promise<any>;
    /**
     * returns the balance of the coin for an account
     *
     * @param address address of the desired account
     * @param coin_type_path address path of the desired coin
     * @returns number of coins
     */
    getCoinBalance(address: string, coin_type_path: string): Promise<number>;
    /**
     * returns the list of all the custom coins for an account
     *
     * @param address address of the desired account
     * @returns array of coins with their data
     */
    getCustomCoins(address: string): Promise<any[]>;
    publishModule(sender: AptosAccount, packageMetadataHex: string, moduleHex: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
}
//# sourceMappingURL=wallet_client.d.ts.map