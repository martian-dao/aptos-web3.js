export declare const $MoveValue: {
    readonly type: "any-of";
    readonly description: "An enum of the possible Move value types";
    readonly contains: readonly [{
        readonly type: "number";
        readonly format: "uint8";
    }, {
        readonly type: "number";
        readonly format: "uint16";
    }, {
        readonly type: "number";
        readonly format: "uint32";
    }, {
        readonly type: "U64";
    }, {
        readonly type: "U128";
    }, {
        readonly type: "U256";
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