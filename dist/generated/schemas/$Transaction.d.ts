export declare const $Transaction: {
    readonly type: "one-of";
    readonly contains: readonly [{
        readonly type: "Transaction_PendingTransaction";
    }, {
        readonly type: "Transaction_UserTransaction";
    }, {
        readonly type: "Transaction_GenesisTransaction";
    }, {
        readonly type: "Transaction_BlockMetadataTransaction";
    }, {
        readonly type: "Transaction_StateCheckpointTransaction";
    }];
};
//# sourceMappingURL=$Transaction.d.ts.map