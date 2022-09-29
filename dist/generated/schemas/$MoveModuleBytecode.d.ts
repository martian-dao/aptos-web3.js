export declare const $MoveModuleBytecode: {
    readonly description: "Move module bytecode along with it's ABI";
    readonly properties: {
        readonly bytecode: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
        readonly abi: {
            readonly type: "MoveModule";
        };
    };
};
//# sourceMappingURL=$MoveModuleBytecode.d.ts.map