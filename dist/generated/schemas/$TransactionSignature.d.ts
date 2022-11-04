export declare const $TransactionSignature: {
    readonly type: "one-of";
    readonly description: "An enum representing the different transaction signatures available";
    readonly contains: readonly [{
        readonly type: "TransactionSignature_Ed25519Signature";
    }, {
        readonly type: "TransactionSignature_MultiEd25519Signature";
    }, {
        readonly type: "TransactionSignature_MultiAgentSignature";
    }];
};
//# sourceMappingURL=$TransactionSignature.d.ts.map