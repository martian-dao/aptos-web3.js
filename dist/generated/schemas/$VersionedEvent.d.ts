export declare const $VersionedEvent: {
    readonly description: "An event from a transaction with a version";
    readonly properties: {
        readonly version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly guid: {
            readonly type: "EventGuid";
            readonly isRequired: true;
        };
        readonly sequence_number: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly type: {
            readonly type: "MoveType";
            readonly isRequired: true;
        };
        readonly data: {
            readonly description: "The JSON representation of the event";
            readonly properties: {};
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$VersionedEvent.d.ts.map