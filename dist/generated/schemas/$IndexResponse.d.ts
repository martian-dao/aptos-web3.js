export declare const $IndexResponse: {
    readonly description: "The struct holding all data returned to the client by the\n    index endpoint (i.e., GET \"/\").  Only for responding in JSON";
    readonly properties: {
        readonly chain_id: {
            readonly type: "number";
            readonly description: "Chain ID of the current chain";
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
        readonly git_hash: {
            readonly type: "string";
            readonly description: "Git hash of the build of the API endpoint.  Can be used to determine the exact\n            software version used by the API endpoint.";
        };
    };
};
//# sourceMappingURL=$IndexResponse.d.ts.map