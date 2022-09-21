import { AptosAccount } from "./aptos_account";
import { AptosClient } from "./aptos_client";
import { BCS, TransactionBuilderABI } from "./transaction_builder";
export declare const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
/**
 * Class for working with the coin module, such as transferring coins and
 * checking balances.
 */
export declare class CoinClient {
    aptosClient: AptosClient;
    transactionBuilder: TransactionBuilderABI;
    /**
     * Creates new CoinClient instance
     * @param aptosClient AptosClient instance
     */
    constructor(aptosClient: AptosClient);
    /**
     * Generate, sign, and submit a transaction to the Aptos blockchain API to
     * transfer AptosCoin from one account to another.
     *
     * @param from Account sending the coins
     * @param from Account to receive the coins
     * @param amount Number of coins to transfer
     * @param extraArgs Extra args for building the transaction or configuring how
     * the client should submit and wait for the transaction
     * @returns The hash of the transaction submitted to the API
     */
    transfer(from: AptosAccount, to: AptosAccount, amount: number | bigint, extraArgs?: {
        coinType?: string;
        maxGasAmount?: BCS.Uint64;
        gasUnitPrice?: BCS.Uint64;
        expireTimestamp?: BCS.Uint64;
    }): Promise<string>;
    /**
     * Generate, submit, and wait for a transaction to transfer AptosCoin from
     * one account to another.
     *
     * If the transaction is submitted successfully, it returns the response
     * from the API indicating that the transaction was submitted.
     *
     * @param account Account that you want to check the balance of.
     * @param extraArgs Extra args for checking the balance.
     * @returns Promise that resolves to the balance as a bigint.
     */
    checkBalance(account: AptosAccount, extraArgs?: {
        coinType?: string;
    }): Promise<bigint>;
}
//# sourceMappingURL=coin_client.d.ts.map