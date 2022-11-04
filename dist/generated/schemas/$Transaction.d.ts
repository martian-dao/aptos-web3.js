export declare const $Transaction: {
    readonly type: "one-of";
    readonly description: "Enum of the different types of transactions in Aptos";
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