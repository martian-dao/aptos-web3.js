import type { Block } from '../models/Block';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export declare class BlocksService {
    readonly httpRequest: BaseHttpRequest;
    constructor(httpRequest: BaseHttpRequest);
    /**
     * Get blocks by height
     * This endpoint allows you to get the transactions in a block
     * and the corresponding block information.
     *
     * Transactions are limited by max default transactions size.  If not all transactions
     * are present, the user will need to query for the rest of the transactions via the
     * get transactions API.
     *
     * If the block is pruned, it will return a 410
     * @param blockHeight Block height to lookup.  Starts at 0
     * @param withTransactions If set to true, include all transactions in the block
     *
     * If not provided, no transactions will be retrieved
     * @returns Block
     * @throws ApiError
     */
    getBlockByHeight(blockHeight: number, withTransactions?: boolean): CancelablePromise<Block>;
    /**
     * Get blocks by version
     * This endpoint allows you to get the transactions in a block
     * and the corresponding block information given a version in the block.
     *
     * Transactions are limited by max default transactions size.  If not all transactions
     * are present, the user will need to query for the rest of the transactions via the
     * get transactions API.
     *
     * If the block has been pruned, it will return a 410
     * @param version Ledger version to lookup block information for.
     * @param withTransactions If set to true, include all transactions in the block
     *
     * If not provided, no transactions will be retrieved
     * @returns Block
     * @throws ApiError
     */
    getBlockByVersion(version: number, withTransactions?: boolean): CancelablePromise<Block>;
}
//# sourceMappingURL=BlocksService.d.ts.map