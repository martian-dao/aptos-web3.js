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
     * @param blockHeight
     * @param withTransactions
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
     * @param version
     * @param withTransactions
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