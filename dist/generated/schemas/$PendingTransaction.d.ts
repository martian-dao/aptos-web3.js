export declare const $PendingTransaction: {
    readonly properties: {
        readonly hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly sender: {
            readonly type: "Address";
            readonly isRequired: true;
        };
        readonly sequence_number: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly max_gas_amount: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly gas_unit_price: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly expiration_timestamp_secs: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly payload: {
            readonly type: "TransactionPayload";
            readonly isRequired: true;
        };
        readonly signature: {
            readonly type: "TransactionSignature";
        };
    };
};
//# sourceMappingURL=$PendingTransaction.d.ts.map