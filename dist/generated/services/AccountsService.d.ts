import type { AccountData } from '../models/AccountData';
import type { Address } from '../models/Address';
import type { IdentifierWrapper } from '../models/IdentifierWrapper';
import type { MoveModuleBytecode } from '../models/MoveModuleBytecode';
import type { MoveResource } from '../models/MoveResource';
import type { MoveStructTag } from '../models/MoveStructTag';
import type { U64 } from '../models/U64';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export declare class AccountsService {
    readonly httpRequest: BaseHttpRequest;
    constructor(httpRequest: BaseHttpRequest);
    /**
     * Get account
     * Return high level information about an account such as its sequence number.
     * @param address
     * @param ledgerVersion
     * @returns AccountData
     * @throws ApiError
     */
    getAccount(address: Address, ledgerVersion?: U64): CancelablePromise<AccountData>;
    /**
     * Get account resources
     * This endpoint returns all account resources at a given address at a
     * specific ledger version (AKA transaction version). If the ledger
     * version is not specified in the request, the latest ledger version is used.
     *
     * The Aptos nodes prune account state history, via a configurable time window (link).
     * If the requested data has been pruned, the server responds with a 404.
     * @param address
     * @param ledgerVersion
     * @returns MoveResource
     * @throws ApiError
     */
    getAccountResources(address: Address, ledgerVersion?: U64): CancelablePromise<Array<MoveResource>>;
    /**
     * Get account modules
     * This endpoint returns all account modules at a given address at a
     * specific ledger version (AKA transaction version). If the ledger
     * version is not specified in the request, the latest ledger version is used.
     *
     * The Aptos nodes prune account state history, via a configurable time window (link).
     * If the requested data has been pruned, the server responds with a 404.
     * @param address
     * @param ledgerVersion
     * @returns MoveModuleBytecode
     * @throws ApiError
     */
    getAccountModules(address: Address, ledgerVersion?: U64): CancelablePromise<Array<MoveModuleBytecode>>;
    /**
     * Get specific account resource
     * This endpoint returns the resource of a specific type residing at a given
     * account at a specified ledger version (AKA transaction version). If the
     * ledger version is not specified in the request, the latest ledger version
     * is used.
     *
     * The Aptos nodes prune account state history, via a configurable time window (link).
     * If the requested data has been pruned, the server responds with a 404.
     * @param address
     * @param resourceType
     * @param ledgerVersion
     * @returns MoveResource
     * @throws ApiError
     */
    getAccountResource(address: Address, resourceType: MoveStructTag, ledgerVersion?: U64): CancelablePromise<MoveResource>;
    /**
     * Get specific account module
     * This endpoint returns the module with a specific name residing at a given
     * account at a specified ledger version (AKA transaction version). If the
     * ledger version is not specified in the request, the latest ledger version
     * is used.
     *
     * The Aptos nodes prune account state history, via a configurable time window (link).
     * If the requested data has been pruned, the server responds with a 404.
     * @param address
     * @param moduleName
     * @param ledgerVersion
     * @returns MoveModuleBytecode
     * @throws ApiError
     */
    getAccountModule(address: Address, moduleName: IdentifierWrapper, ledgerVersion?: U64): CancelablePromise<MoveModuleBytecode>;
}
//# sourceMappingURL=AccountsService.d.ts.map