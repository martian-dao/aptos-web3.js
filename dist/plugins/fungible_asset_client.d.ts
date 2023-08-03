import { AptosAccount } from "../account";
import { RawTransaction } from "../aptos_types";
import { OptionalTransactionArgs, Provider } from "../providers";
import { MaybeHexString } from "../utils";
export declare class FungibleAssetClient {
    provider: Provider;
    readonly assetType: string;
    /**
     * Creates new FungibleAssetClient instance
     *
     * @param provider Provider instance
     */
    constructor(provider: Provider);
    /**
     *  Transfer `amount` of fungible asset from sender's primary store to recipient's primary store.
     *
     * Use this method to transfer any fungible asset including fungible token.
     *
     * @param sender The sender account
     * @param fungibleAssetMetadataAddress The fungible asset address.
     * For example if you’re transferring USDT this would be the USDT address
     * @param recipient Recipient address
     * @param amount Number of assets to transfer
     * @returns The hash of the transaction submitted to the API
     */
    transfer(sender: AptosAccount, fungibleAssetMetadataAddress: MaybeHexString, recipient: MaybeHexString, amount: number | bigint, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Get the balance of a fungible asset from the account's primary fungible store.
     *
     * @param account Account that you want to get the balance of.
     * @param fungibleAssetMetadataAddress The fungible asset address you want to check the balance of
     * @returns Promise that resolves to the balance
     */
    getPrimaryBalance(account: MaybeHexString, fungibleAssetMetadataAddress: MaybeHexString): Promise<bigint>;
    /**
     *
     * Generate a transfer transaction that can be used to sign and submit to transfer an asset amount
     * from the sender primary fungible store to the recipient primary fungible store.
     *
     * This method can be used if you want/need to get the raw transaction so you can
     * first simulate the transaction and then sign and submit it.
     *
     * @param sender The sender account
     * @param fungibleAssetMetadataAddress The fungible asset address.
     * For example if you’re transferring USDT this would be the USDT address
     * @param recipient Recipient address
     * @param amount Number of assets to transfer
     * @returns Raw Transaction
     */
    generateTransfer(sender: AptosAccount, fungibleAssetMetadataAddress: MaybeHexString, recipient: MaybeHexString, amount: number | bigint, extraArgs?: OptionalTransactionArgs): Promise<RawTransaction>;
}
//# sourceMappingURL=fungible_asset_client.d.ts.map