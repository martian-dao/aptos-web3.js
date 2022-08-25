export declare const $AptosError: {
    readonly description: "This is the generic struct we use for all API errors, it contains a string\n    message and an Aptos API specific error code.";
    readonly properties: {
        readonly message: {
            readonly type: "string";
            readonly isRequired: true;
        };
        readonly error_code: {
            readonly type: "AptosErrorCode";
        };
        readonly aptos_ledger_version: {
            readonly type: "U64";
        };
    };
};
//# sourceMappingURL=$AptosError.d.ts.map