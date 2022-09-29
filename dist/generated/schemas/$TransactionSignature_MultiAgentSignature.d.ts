export declare const $TransactionSignature_MultiAgentSignature: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "MultiAgentSignature";
    }];
};
//# sourceMappingURL=$TransactionSignature_MultiAgentSignature.d.ts.map