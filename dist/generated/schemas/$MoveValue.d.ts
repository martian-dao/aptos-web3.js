export declare const $MoveValue: {
    readonly type: "any-of";
    readonly contains: readonly [{
        readonly type: "number";
        readonly format: "uint8";
    }, {
        readonly type: "U64";
    }, {
        readonly type: "U128";
    }, {
        readonly type: "boolean";
    }, {
        readonly type: "Address";
    }, {
        readonly type: "array";
        readonly contains: {
            readonly type: "MoveValue";
        };
    }, {
        readonly type: "HexEncodedBytes";
    }, {
        readonly type: "MoveStructValue";
    }, {
        readonly type: "string";
    }];
};
//# sourceMappingURL=$MoveValue.d.ts.map