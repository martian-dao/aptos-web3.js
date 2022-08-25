export declare const $StateCheckpointTransaction: {
    readonly properties: {
        readonly version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly state_root_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly event_root_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
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
        readonly timestamp: {
            readonly type: "U64";
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$StateCheckpointTransaction.d.ts.map