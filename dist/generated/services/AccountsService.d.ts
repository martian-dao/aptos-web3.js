import type { AccountData } from '../models/AccountData';
import type { Address } from '../models/Address';
import type { IdentifierWrapper } from '../models/IdentifierWrapper';
import type { MoveModuleBytecode } from '../models/MoveModuleBytecode';
import type { MoveResource } from '../models/MoveResource';
import type { MoveStructTag } from '../models/MoveStructTag';
import type { StateKeyWrapper } from '../models/StateKeyWrapper';
import type { U64 } from '../models/U64';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export declare class AccountsService {
    readonly httpRequest: BaseHttpRequest;
    constructor(httpRequest: BaseHttpRequest);
    /**
     * Get account
     * Return the authentication key and the sequence number for an account
     * address. Optionally, a ledger version can be specified. If the ledger
     * version is not specified in the request, the latest ledger version is used.
     * @param address Address of account with or without a `0x` prefix
     * @param ledgerVersion Ledger version to get state of account
     *
     * If not provided, it will be the latest version
     * @returns AccountData
     * @throws ApiError
     */
    getAccount(address: Address, ledgerVersion?: U64): CancelablePromise<AccountData>;
    /**
     * Get account resources
     * Retrieves all account resources for a given account and a specific ledger version.  If the
     * ledger version is not specified in the request, the latest ledger version is used.
     *
     * The Aptos nodes prune account state history, via a configurable time window.
     * If the requested ledger version has been pruned, the server responds with a 410.
     * @param address Address of account with or without a `0x` prefix
     * @param ledgerVersion Ledger version to get state of account
     *
     * If not provided, it will be the latest version
     * @param start Cursor specifying where to start for pagination
     *
     * This cursor cannot be derived manually client-side. Instead, you must
     * call this endpoint once without this query parameter specified, and
     * then use the cursor returned in the X-Aptos-Cursor header in the
     * response.
     * @param limit Max number of account resources to retrieve
     *
     * If not provided, defaults to default page size.
     * @returns MoveResource
     * @throws ApiError
     */
    getAccountResources(address: Address, ledgerVersion?: U64, start?: StateKeyWrapper, limit?: number): CancelablePromise<Array<MoveResource>>;
    /**
     * Get account modules
     * Retrieves all account modules' bytecode for a given account at a specific ledger version.
     * If the ledger version is not specified in the request, the latest ledger version is used.
     *
     * The Aptos nodes prune account state history, via a configurable time window.
     * If the requested ledger version has been pruned, the server responds with a 410.
     * @param address Address of account with or without a `0x` prefix
     * @param ledgerVersion Ledger version to get state of account
     *
     * If not provided, it will be the latest version
     * @param start Cursor specifying where to start for pagination
     *
     * This cursor cannot be derived manually client-side. Instead, you must
     * call this endpoint once without this query parameter specified, and
     * then use the cursor returned in the X-Aptos-Cursor header in the
     * response.
     * @param limit Max number of account modules to retrieve
     *
     * If not provided, defaults to default page size.
     * @returns MoveModuleBytecode
     * @throws ApiError
     */
    getAccountModules(address: Address, ledgerVersion?: U64, start?: StateKeyWrapper, limit?: number): CancelablePromise<Array<MoveModuleBytecode>>;
    /**
     * Get account resource
     * Retrieves an individual resource from a given account and at a specific ledger version. If the
     * ledger version is not specified in the request, the latest ledger version is used.
     *
     * The Aptos nodes prune account state history, via a configurable time window.
     * If the requested ledger version has been pruned, the server responds with a 410.
     * @param address Address of account with or without a `0x` prefix
     * @param resourceType Name of struct to retrieve e.g. `0x1::account::Account`
     * @param ledgerVersion Ledger version to get state of account
     *
     * If not provided, it will be the latest version
     * @returns MoveResource
     * @throws ApiError
     */
    getAccountResource(address: Address, resourceType: MoveStructTag, ledgerVersion?: U64): CancelablePromise<MoveResource>;
    /**
     * Get account module
     * Retrieves an individual module from a given account and at a specific ledger version. If the
     * ledger version is not specified in the request, the latest ledger version is used.
     *
     * The Aptos nodes prune account state history, via a configurable time window.
     * If the requested ledger version has been pruned, the server responds with a 410.
     * @param address Address of account with or without a `0x` prefix
     * @param moduleName Name of module to retrieve e.g. `coin`
     * @param ledgerVersion Ledger version to get state of account
     *
     * If not provided, it will be the latest version
     * @returns MoveModuleBytecode
     * @throws ApiError
     */
    getAccountModule(address: Address, moduleName: IdentifierWrapper, ledgerVersion?: U64): CancelablePromise<MoveModuleBytecode>;
}
//# sourceMappingURL=AccountsService.d.ts.map