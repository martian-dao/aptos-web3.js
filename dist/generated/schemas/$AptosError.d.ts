export declare const $AptosError: {
    readonly description: "This is the generic struct we use for all API errors, it contains a string\n    message and an Aptos API specific error code.";
    readonly properties: {
        readonly message: {
            readonly type: "string";
            readonly description: "A message describing the error";
            readonly isRequired: true;
        };
        readonly error_code: {
            readonly type: "AptosErrorCode";
            readonly isRequired: true;
        };
        readonly vm_error_code: {
            readonly type: "number";
            readonly description: "A code providing VM error details when submitting transactions to the VM";
            readonly format: "uint64";
        };
    };
};
//# sourceMappingURL=$AptosError.d.ts.map