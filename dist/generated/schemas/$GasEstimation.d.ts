export declare const $GasEstimation: {
    readonly description: "Struct holding the outputs of the estimate gas API";
    readonly properties: {
        readonly deprioritized_gas_estimate: {
            readonly type: "number";
            readonly description: "The deprioritized estimate for the gas unit price";
            readonly format: "uint64";
        };
        readonly gas_estimate: {
            readonly type: "number";
            readonly description: "The current estimate for the gas unit price";
            readonly isRequired: true;
            readonly format: "uint64";
        };
        readonly prioritized_gas_estimate: {
            readonly type: "number";
            readonly description: "The prioritized estimate for the gas unit price";
            readonly format: "uint64";
        };
    };
};
//# sourceMappingURL=$GasEstimation.d.ts.map