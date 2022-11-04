export declare const $EncodeSubmissionRequest: {
    readonly description: "Request to encode a submission";
    readonly properties: {
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
        readonly secondary_signers: {
            readonly type: "array";
            readonly contains: {
                readonly type: "Address";
            };
        };
    };
};
//# sourceMappingURL=$EncodeSubmissionRequest.d.ts.map