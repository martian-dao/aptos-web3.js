export declare const $TransactionsBatchSubmissionResult: {
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