export declare const $TransactionPayload: {
    readonly type: "one-of";
    readonly description: "An enum of the possible transaction payloads";
    readonly contains: readonly [{
        readonly type: "TransactionPayload_EntryFunctionPayload";
    }, {
        readonly type: "TransactionPayload_ScriptPayload";
    }, {
        readonly type: "TransactionPayload_ModuleBundlePayload";
    }];
};
//# sourceMappingURL=$TransactionPayload.d.ts.map