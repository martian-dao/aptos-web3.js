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
     * @param blockHeight
     * @param withTransactions
     * @returns Block
     * @throws ApiError
     */
    getBlockByHeight(blockHeight: number, withTransactions?: boolean): CancelablePromise<Block>;
    /**
     * Get blocks by version
     * This endpoint allows you to get the transactions in a block
     * and the corresponding block information given a version in the block.
     * @param version
     * @param withTransactions
     * @returns Block
     * @throws ApiError
     */
    getBlockByVersion(version: number, withTransactions?: boolean): CancelablePromise<Block>;
}
//# sourceMappingURL=BlocksService.d.ts.map