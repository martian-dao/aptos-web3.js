import { AptosAccount } from "../account/aptos_account";
import { AptosClient, OptionalTransactionArgs } from "../providers/aptos_client";
import { MaybeHexString } from "../utils";
/**
 * Class for working with the coin module, such as transferring coins and
 * checking balances.
 */
export declare class CoinClient {
    aptosClient: AptosClient;
    /**
     * Creates new CoinClient instance
     * @param aptosClient AptosClient instance
     */
    constructor(aptosClient: AptosClient);
    /**
     * Generate, sign, and submit a transaction to the Aptos blockchain API to
     * transfer coins from one account to another. By default it transfers
     * 0x1::aptos_coin::AptosCoin, but you can specify a different coin type
     * with the `coinType` argument.
     *
     * You may set `createReceiverIfMissing` to true if you want to create the
     * receiver account if it does not exist on chain yet. If you do not set
     * this to true, the transaction will fail if the receiver account does not
     * exist on-chain.
     *
     * @param from Account sending the coins
     * @param to Account to receive the coins
     * @param amount Number of coins to transfer
     * @param extraArgs Extra args for building the transaction or configuring how
     * the client should submit and wait for the transaction
     * @returns The hash of the transaction submitted to the API
     */
    transfer(from: AptosAccount, to: AptosAccount | MaybeHexString, amount: number | bigint, extraArgs?: OptionalTransactionArgs & {
        coinType?: string;
        createReceiverIfMissing?: boolean;
    }): Promise<string>;
    /**
     * Get the balance of the account. By default it checks the balance of
     * 0x1::aptos_coin::AptosCoin, but you can specify a different coin type.
     *
     * @param account Account that you want to get the balance of.
     * @param extraArgs Extra args for checking the balance.
     * @returns Promise that resolves to the balance as a bigint.
     */
    checkBalance(account: AptosAccount | MaybeHexString, extraArgs?: {
        coinType?: string;
    }): Promise<bigint>;
}
//# sourceMappingURL=coin_client.d.ts.map