import type { AptosErrorCode } from './AptosErrorCode';
/**
 * This is the generic struct we use for all API errors, it contains a string
 * message and an Aptos API specific error code.
 */
export declare type AptosError = {
    /**
     * A message describing the error
     */
    message: string;
    error_code: AptosErrorCode;
    /**
     * A code providing VM error details when submitting transactions to the VM
     */
    vm_error_code?: number;
};
//# sourceMappingURL=AptosError.d.ts.map