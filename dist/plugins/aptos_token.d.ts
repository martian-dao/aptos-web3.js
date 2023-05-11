import { AptosAccount } from "../account/aptos_account";
import { AnyNumber } from "../bcs";
import { Provider } from "../providers";
import { OptionalTransactionArgs } from "../providers/aptos_client";
import { MaybeHexString } from "../utils";
export interface CreateCollectionOptions {
    royaltyNumerator?: number;
    royaltyDenominator?: number;
    mutableDescription?: boolean;
    mutableRoyalty?: boolean;
    mutableURI?: boolean;
    mutableTokenDescription?: boolean;
    mutableTokenName?: boolean;
    mutableTokenProperties?: boolean;
    mutableTokenURI?: boolean;
    tokensBurnableByCreator?: boolean;
    tokensFreezableByCreator?: boolean;
}
declare const PropertyTypeMap: {
    BOOLEAN: string;
    U8: string;
    U16: string;
    U32: string;
    U64: string;
    U128: string;
    U256: string;
    ADDRESS: string;
    VECTOR: string;
    STRING: string;
};
export type PropertyType = keyof typeof PropertyTypeMap;
/**
 * Class for managing aptos_token
 */
export declare class AptosToken {
    readonly provider: Provider;
    private readonly tokenType;
    /**
     * Creates new AptosToken instance
     *
     * @param provider Provider instance
     */
    constructor(provider: Provider);
    private submitTransaction;
    /**
     * Creates a new collection within the specified account
     *
     * @param creator AptosAccount where collection will be created
     * @param description Collection description
     * @param name Collection name
     * @param uri URL to additional info about collection
     * @param options CreateCollectionOptions type. By default all values set to `true` or `0`
     * @returns The hash of the transaction submitted to the API
     */
    createCollection(creator: AptosAccount, description: string, name: string, uri: string, maxSupply?: AnyNumber, options?: CreateCollectionOptions, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Mint a new token within the specified account
     *
     * @param account AptosAccount where token will be created
     * @param collection Name of collection, that token belongs to
     * @param description Token description
     * @param name Token name
     * @param uri URL to additional info about token
     * @param propertyKeys the property keys for storing on-chain properties
     * @param propertyTypes the type of property values
     * @param propertyValues the property values to be stored on-chain
     * @returns The hash of the transaction submitted to the API
     */
    mint(account: AptosAccount, collection: string, description: string, name: string, uri: string, propertyKeys?: Array<string>, propertyTypes?: Array<string>, propertyValues?: Array<string>, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Mint a soul bound token into a recipient's account
     *
     * @param account AptosAccount that mints the token
     * @param collection Name of collection, that token belongs to
     * @param description Token description
     * @param name Token name
     * @param uri URL to additional info about token
     * @param recipient AptosAccount where token will be created
     * @param propertyKeys the property keys for storing on-chain properties
     * @param propertyTypes the type of property values
     * @param propertyValues the property values to be stored on-chain
     * @returns The hash of the transaction submitted to the API
     */
    mintSoulBound(account: AptosAccount, collection: string, description: string, name: string, uri: string, recipient: AptosAccount, propertyKeys?: Array<string>, propertyTypes?: Array<string>, propertyValues?: Array<string>, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Burn a token by its creator
     * @param creator Creator account
     * @param token Token address
     * @returns The hash of the transaction submitted to the API
     */
    burnToken(creator: AptosAccount, token: MaybeHexString, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Freeze token transfer ability
     * @param creator Creator account
     * @param token Token address
     * @returns The hash of the transaction submitted to the API
     */
    freezeTokenTransafer(creator: AptosAccount, token: MaybeHexString, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Unfreeze token transfer ability
     * @param creator Creator account
     * @param token Token address
     * @returns The hash of the transaction submitted to the API
     */
    unfreezeTokenTransafer(creator: AptosAccount, token: MaybeHexString, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Set token description
     * @param creator Creator account
     * @param token Token address
     * @param description Token description
     * @returns The hash of the transaction submitted to the API
     */
    setTokenDescription(creator: AptosAccount, token: MaybeHexString, description: string, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Set token name
     * @param creator Creator account
     * @param token Token address
     * @param name Token name
     * @returns The hash of the transaction submitted to the API
     */
    setTokenName(creator: AptosAccount, token: MaybeHexString, name: string, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Set token URI
     * @param creator Creator account
     * @param token Token address
     * @param uri Token uri
     * @returns The hash of the transaction submitted to the API
     */
    setTokenURI(creator: AptosAccount, token: MaybeHexString, uri: string, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Add token property
     * @param creator Creator account
     * @param token Token address
     * @param key the property key for storing on-chain property
     * @param type the type of property value
     * @param value the property value to be stored on-chain
     * @returns The hash of the transaction submitted to the API
     */
    addTokenProperty(creator: AptosAccount, token: MaybeHexString, propertyKey: string, propertyType: PropertyType, propertyValue: string, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Remove token property
     * @param creator Creator account
     * @param token Token address
     * @param key the property key stored on-chain
     * @returns The hash of the transaction submitted to the API
     */
    removeTokenProperty(creator: AptosAccount, token: MaybeHexString, propertyKey: string, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Update token property
     * @param creator Creator account
     * @param token Token address
     * @param key the property key stored on-chain
     * @param type the property typed stored on-chain
     * @param value the property value to be stored on-chain
     * @returns The hash of the transaction submitted to the API
     */
    updateTokenProperty(creator: AptosAccount, token: MaybeHexString, propertyKey: string, propertyType: PropertyType, propertyValue: string, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    addTypedProperty(creator: AptosAccount, token: MaybeHexString, propertyKey: string, propertyType: PropertyType, propertyValue: string, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    updateTypedProperty(creator: AptosAccount, token: MaybeHexString, propertyKey: string, propertyType: PropertyType, propertyValue: string, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Transfer a token ownership.
     * We can transfer a token only when the token is not frozen (i.e. owner transfer is not disabled such as for soul bound tokens)
     * @param owner The account of the current token owner
     * @param token Token address
     * @param recipient Recipient address
     * @returns The hash of the transaction submitted to the API
     */
    transferTokenOwnership(owner: AptosAccount, token: MaybeHexString, recipient: MaybeHexString, tokenType?: string, extraArgs?: OptionalTransactionArgs): Promise<string>;
}
export {};
//# sourceMappingURL=aptos_token.d.ts.map