"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlocksService = void 0;
class BlocksService {
    constructor(httpRequest) {
        this.httpRequest = httpRequest;
    }
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
    getBlockByHeight(blockHeight, withTransactions) {
        return this.httpRequest.request({
            method: 'GET',
            url: '/blocks/by_height/{block_height}',
            path: {
                'block_height': blockHeight,
            },
            query: {
                'with_transactions': withTransactions,
            },
        });
    }
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
    getBlockByVersion(version, withTransactions) {
        return this.httpRequest.request({
            method: 'GET',
            url: '/blocks/by_version/{version}',
            path: {
                'version': version,
            },
            query: {
                'with_transactions': withTransactions,
            },
        });
    }
}
exports.BlocksService = BlocksService;
//# sourceMappingURL=BlocksService.js.map