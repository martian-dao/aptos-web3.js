export declare const $Block: {
    readonly properties: {
        readonly block_height: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly block_hash: {
            readonly type: "HashValue";
            readonly isRequired: true;
        };
        readonly block_timestamp: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly first_version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly last_version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly transactions: {
            readonly type: "array";
            readonly contains: {
                readonly type: "Transaction";
            };
        };
    };
};
//# sourceMappingURL=$Block.d.ts.map