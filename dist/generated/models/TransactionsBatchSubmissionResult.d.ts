import type { TransactionsBatchSingleSubmissionFailure } from './TransactionsBatchSingleSubmissionFailure';
/**
 * Batch transaction submission result
 *
 * Tells which transactions failed
 */
export declare type TransactionsBatchSubmissionResult = {
    /**
     * Summary of the failed transactions
     */
    transaction_failures: Array<TransactionsBatchSingleSubmissionFailure>;
};
//# sourceMappingURL=TransactionsBatchSubmissionResult.d.ts.map