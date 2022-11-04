export declare const $TransactionSignature_MultiEd25519Signature: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "MultiEd25519Signature";
    }];
};
//# sourceMappingURL=$TransactionSignature_MultiEd25519Signature.d.ts.map