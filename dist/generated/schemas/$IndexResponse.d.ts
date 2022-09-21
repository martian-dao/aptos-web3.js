export declare const $IndexResponse: {
    readonly description: "The struct holding all data returned to the client by the\n    index endpoint (i.e., GET \"/\").";
    readonly properties: {
        readonly chain_id: {
            readonly type: "number";
            readonly isRequired: true;
            readonly format: "uint8";
        };
        readonly epoch: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly ledger_version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly oldest_ledger_version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly ledger_timestamp: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly node_role: {
            readonly type: "RoleType";
            readonly isRequired: true;
        };
        readonly oldest_block_height: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly block_height: {
            readonly type: "U64";
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$IndexResponse.d.ts.map