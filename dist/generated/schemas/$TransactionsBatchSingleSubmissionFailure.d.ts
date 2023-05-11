export declare const $TransactionsBatchSingleSubmissionFailure: {
    readonly description: "Information telling which batch submission transactions failed";
    readonly properties: {
        readonly error: {
            readonly type: "AptosError";
            readonly isRequired: true;
        };
        readonly transaction_index: {
            readonly type: "number";
            readonly description: "The index of which transaction failed, same as submission order";
            readonly isRequired: true;
            readonly format: "uint64";
        };
    };
};
//# sourceMappingURL=$TransactionsBatchSingleSubmissionFailure.d.ts.map