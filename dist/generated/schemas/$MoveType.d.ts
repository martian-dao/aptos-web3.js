export declare const $MoveType: {
    readonly type: "string";
    readonly description: "String representation of an on-chain Move type tag that is exposed in transaction payload.\n    Values:\n    - bool\n    - u8\n    - u64\n    - u128\n    - address\n    - signer\n    - vector: `vector<{non-reference MoveTypeId}>`\n    - struct: `{address}::{module_name}::{struct_name}::<{generic types}>`\n\n    Vector type value examples:\n    - `vector<u8>`\n    - `vector<vector<u64>>`\n    - `vector<0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>>`\n\n    Struct type value examples:\n    - `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>\n    - `0x1::account::Account`\n\n    Note:\n    1. Empty chars should be ignored when comparing 2 struct tag ids.\n    2. When used in an URL path, should be encoded by url-encoding (AKA percent-encoding).\n    ";
    readonly pattern: "^(bool|u8|u64|u128|address|signer|vector<.+>|0x[0-9a-zA-Z:_<, >]+)$";
};
//# sourceMappingURL=$MoveType.d.ts.map