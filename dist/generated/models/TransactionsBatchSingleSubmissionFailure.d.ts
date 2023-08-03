import type { AptosError } from './AptosError';
/**
 * Information telling which batch submission transactions failed
 */
export declare type TransactionsBatchSingleSubmissionFailure = {
    error: AptosError;
    /**
     * The index of which transaction failed, same as submission order
     */
    transaction_index: number;
};
//# sourceMappingURL=TransactionsBatchSingleSubmissionFailure.d.ts.map