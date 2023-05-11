export declare const $MoveStructTag: {
    readonly type: "string";
    readonly description: "String representation of a MoveStructTag (on-chain Move struct type). This exists so you\n    can specify MoveStructTags as path / query parameters, e.g. for get_events_by_event_handle.\n\n    It is a combination of:\n    1. `move_module_address`, `module_name` and `struct_name`, all joined by `::`\n    2. `struct generic type parameters` joined by `, `\n\n    Examples:\n     * `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`\n     * `0x1::account::Account`\n\n    Note:\n    1. Empty chars should be ignored when comparing 2 struct tag ids.\n    2. When used in an URL path, should be encoded by url-encoding (AKA percent-encoding).\n\n    See [doc](https://aptos.dev/concepts/accounts) for more details.\n    ";
    readonly pattern: "^0x[0-9a-zA-Z:_<>]+$";
};
//# sourceMappingURL=$MoveStructTag.d.ts.map