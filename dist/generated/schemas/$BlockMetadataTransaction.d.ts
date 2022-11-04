export declare const $BlockMetadataTransaction: {
    readonly description: "A block metadata transaction\n\n    This signifies the beginning of a block, and contains information\n    about the specific block";
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
            readonly description: "Whether the transaction was successful";
            readonly isRequired: true;
        };
        readonly vm_status: {
            readonly type: "string";
            readonly description: "The VM status of the transaction, can tell useful information in a failure";
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
        readonly id: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly epoch: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly round: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly events: {
            readonly type: "array";
            readonly contains: {
                readonly type: "Event";
            };
            readonly isRequired: true;
        };
        readonly previous_block_votes_bitvec: {
            readonly type: "array";
            readonly contains: {
                readonly type: "number";
                readonly format: "uint8";
            };
            readonly isRequired: true;
        };
        readonly proposer: {
            readonly type: "Address";
            readonly isRequired: true;
        };
        readonly failed_proposer_indices: {
            readonly type: "array";
            readonly contains: {
                readonly type: "number";
                readonly format: "uint32";
            };
            readonly isRequired: true;
        };
        readonly timestamp: {
            readonly type: "U64";
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$BlockMetadataTransaction.d.ts.map