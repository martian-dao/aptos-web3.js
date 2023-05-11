import type { MoveValue } from '../models/MoveValue';
import type { U64 } from '../models/U64';
import type { ViewRequest } from '../models/ViewRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export declare class ViewService {
    readonly httpRequest: BaseHttpRequest;
    constructor(httpRequest: BaseHttpRequest);
    /**
     * Execute view function of a module
     * Execute the Move function with the given parameters and return its execution result.
     *
     * The Aptos nodes prune account state history, via a configurable time window.
     * If the requested ledger version has been pruned, the server responds with a 410.
     * @param requestBody
     * @param ledgerVersion Ledger version to get state of account
     *
     * If not provided, it will be the latest version
     * @returns MoveValue
     * @throws ApiError
     */
    view(requestBody: ViewRequest, ledgerVersion?: U64): CancelablePromise<Array<MoveValue>>;
}
//# sourceMappingURL=ViewService.d.ts.map