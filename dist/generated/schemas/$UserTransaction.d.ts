export declare const $UserTransaction: {
    readonly properties: {
        readonly version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly state_change_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly event_root_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly state_checkpoint_hash: {
            readonly type: "HashValue";
        };
        readonly gas_used: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly success: {
            readonly type: "boolean";
            readonly isRequired: true;
        };
        readonly vm_status: {
            readonly type: "string";
            readonly isRequired: true;
        };
        readonly accumulator_root_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly changes: {
            readonly type: "array";
            readonly contains: {
                readonly type: "WriteSetChange";
            };
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
        readonly events: {
            readonly type: "array";
            readonly contains: {
                readonly type: "Event";
            };
            readonly isRequired: true;
        };
        readonly timestamp: {
            readonly type: "U64";
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$UserTransaction.d.ts.map