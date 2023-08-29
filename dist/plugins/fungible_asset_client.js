"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FungibleAssetClient = void 0;
const transaction_builder_1 = require("../transaction_builder");
const utils_1 = require("../utils");
class FungibleAssetClient {
    /**
     * Creates new FungibleAssetClient instance
     *
     * @param provider Provider instance
     */
    constructor(provider) {
        this.assetType = "0x1::fungible_asset::Metadata";
        this.provider = provider;
    }
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
    async transfer(sender, fungibleAssetMetadataAddress, recipient, amount, extraArgs) {
        const rawTransaction = await this.generateTransfer(sender, fungibleAssetMetadataAddress, recipient, amount, extraArgs);
        const txnHash = await this.provider.signAndSubmitTransaction(sender, rawTransaction);
        return txnHash;
    }
    /**
     * Get the balance of a fungible asset from the account's primary fungible store.
     *
     * @param account Account that you want to get the balance of.
     * @param fungibleAssetMetadataAddress The fungible asset address you want to check the balance of
     * @returns Promise that resolves to the balance
     */
    async getPrimaryBalance(account, fungibleAssetMetadataAddress) {
        const payload = {
            function: "0x1::primary_fungible_store::balance",
            type_arguments: [this.assetType],
            arguments: [utils_1.HexString.ensure(account).hex(), utils_1.HexString.ensure(fungibleAssetMetadataAddress).hex()],
        };
        const response = await this.provider.view(payload);
        return BigInt(response[0]);
    }
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
    async generateTransfer(sender, fungibleAssetMetadataAddress, recipient, amount, extraArgs) {
        const builder = new transaction_builder_1.TransactionBuilderRemoteABI(this.provider, {
            sender: sender.address(),
            ...extraArgs,
        });
        const rawTxn = await builder.build("0x1::primary_fungible_store::transfer", [this.assetType], [utils_1.HexString.ensure(fungibleAssetMetadataAddress).hex(), utils_1.HexString.ensure(recipient).hex(), amount]);
        return rawTxn;
    }
}
exports.FungibleAssetClient = FungibleAssetClient;
//# sourceMappingURL=fungible_asset_client.js.map