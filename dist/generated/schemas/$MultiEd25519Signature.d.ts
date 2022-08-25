export declare const $MultiEd25519Signature: {
    readonly properties: {
        readonly public_keys: {
            readonly type: "array";
            readonly contains: {
                readonly type: "HexEncodedBytes";
            };
            readonly isRequired: true;
        };
        readonly signatures: {
            readonly type: "array";
            readonly contains: {
                readonly type: "HexEncodedBytes";
            };
            readonly isRequired: true;
        };
        readonly threshold: {
            readonly type: "number";
            readonly isRequired: true;
            readonly format: "uint8";
        };
        readonly bitmap: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$MultiEd25519Signature.d.ts.map