export declare const $TransactionsBatchSubmissionResult: {
    readonly description: "Batch transaction submission result\n\n    Tells which transactions failed";
    readonly properties: {
        readonly transaction_failures: {
            readonly type: "array";
            readonly contains: {
                readonly type: "TransactionsBatchSingleSubmissionFailure";
            };
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$TransactionsBatchSubmissionResult.d.ts.map