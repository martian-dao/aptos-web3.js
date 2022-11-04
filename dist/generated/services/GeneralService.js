"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralService = void 0;
class GeneralService {
    constructor(httpRequest) {
        this.httpRequest = httpRequest;
    }
    /**
     * Show OpenAPI explorer
     * Provides a UI that you can use to explore the API. You can also
     * retrieve the API directly at `/spec.yaml` and `/spec.json`.
     * @returns string
     * @throws ApiError
     */
    spec() {
        return this.httpRequest.request({
            method: 'GET',
            url: '/spec',
        });
    }
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
    healthy(durationSecs) {
        return this.httpRequest.request({
            method: 'GET',
            url: '/-/healthy',
            query: {
                'duration_secs': durationSecs,
            },
        });
    }
    /**
     * Get ledger info
     * Get the latest ledger information, including data such as chain ID,
     * role type, ledger versions, epoch, etc.
     * @returns IndexResponse
     * @throws ApiError
     */
    getLedgerInfo() {
        return this.httpRequest.request({
            method: 'GET',
            url: '/',
        });
    }
}
exports.GeneralService = GeneralService;
//# sourceMappingURL=GeneralService.js.map