export declare const $AccountSignature_Ed25519Signature: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "Ed25519Signature";
    }];
};
//# sourceMappingURL=$AccountSignature_Ed25519Signature.d.ts.map