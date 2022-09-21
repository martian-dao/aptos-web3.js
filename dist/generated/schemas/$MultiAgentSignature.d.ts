export declare const $MultiAgentSignature: {
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