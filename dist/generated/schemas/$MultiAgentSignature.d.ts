export declare const $MultiAgentSignature: {
    readonly description: "Multi agent signature for multi agent transactions\n\n    This allows you to have transactions across multiple accounts";
    readonly properties: {
        readonly sender: {
            readonly type: "AccountSignature";
            readonly isRequired: true;
        };
        readonly secondary_signer_addresses: {
            readonly type: "array";
            readonly contains: {
                readonly type: "Address";
            };
            readonly isRequired: true;
        };
        readonly secondary_signers: {
            readonly type: "array";
            readonly contains: {
                readonly type: "AccountSignature";
            };
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$MultiAgentSignature.d.ts.map