export declare const $EventKey: {
    readonly type: "string";
    readonly description: "Event key is a global index for an event stream.\n\n    It is hex-encoded BCS bytes of `EventHandle` `guid` field value, which is\n    a combination of a `uint64` creation number and account address (without\n    trimming leading zeros).\n\n    For example, event key `0x000000000000000088fbd33f54e1126269769780feb24480428179f552e2313fbe571b72e62a1ca1` is combined by the following 2 parts:\n    1. `0000000000000000`: `uint64` representation of `0`.\n    2. `88fbd33f54e1126269769780feb24480428179f552e2313fbe571b72e62a1ca1`: 32 bytes of account address.\n    ";
    readonly format: "hex";
};
//# sourceMappingURL=$EventKey.d.ts.map