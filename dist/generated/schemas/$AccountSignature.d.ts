export declare const $AccountSignature: {
    readonly type: "one-of";
    readonly description: "Account signature scheme\n\n    The account signature scheme allows you to have two types of accounts:\n\n    1. A single Ed25519 key account, one private key\n    2. A k-of-n multi-Ed25519 key account, multiple private keys, such that k-of-n must sign a transaction.";
    readonly contains: readonly [{
        readonly type: "AccountSignature_Ed25519Signature";
    }, {
        readonly type: "AccountSignature_MultiEd25519Signature";
    }];
};
//# sourceMappingURL=$AccountSignature.d.ts.map