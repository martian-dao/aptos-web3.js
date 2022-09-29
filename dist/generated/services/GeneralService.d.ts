import type { HealthCheckSuccess } from '../models/HealthCheckSuccess';
import type { IndexResponse } from '../models/IndexResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export declare class GeneralService {
    readonly httpRequest: BaseHttpRequest;
    constructor(httpRequest: BaseHttpRequest);
    /**
     * Show OpenAPI explorer
     * Provides a UI that you can use to explore the API. You can also
     * retrieve the API directly at `/spec.yaml` and `/spec.json`.
     * @returns string
     * @throws ApiError
     */
    spec(): CancelablePromise<string>;
    /**
     * Check basic node health
     * By default this endpoint just checks that it can get the latest ledger
     * info and then returns 200.
     *
     * If the duration_secs param is provided, this endpoint will return a
     * 200 if the following condition is true:
     *
     * `server_latest_ledger_info_timestamp >= server_current_time_timestamp - duration_secs`
     * @param durationSecs Threshold in seconds that the server can be behind to be considered healthy
     *
     * If not provided, the healthcheck will always succeed
     * @returns HealthCheckSuccess
     * @throws ApiError
     */
    healthy(durationSecs?: number): CancelablePromise<HealthCheckSuccess>;
    /**
     * Get ledger info
     * Get the latest ledger information, including data such as chain ID,
     * role type, ledger versions, epoch, etc.
     * @returns IndexResponse
     * @throws ApiError
     */
    getLedgerInfo(): CancelablePromise<IndexResponse>;
}
//# sourceMappingURL=GeneralService.d.ts.map