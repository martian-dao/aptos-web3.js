import { PropertyMap, PropertyValue } from "../utils/property_map_serde";
export { PropertyMap, PropertyValue };
export declare class TokenData {
    /** Unique name within this creator's account for this Token's collection */
    collection: string;
    /** Description of Token */
    description: string;
    /** Name of Token */
    name: string;
    /** Optional maximum number of this Token */
    maximum?: number;
    /** Total number of this type of Token */
    supply: number;
    /** URL for additional information / media */
    uri: string;
    /** default properties of token data */
    default_properties: PropertyMap;
    /** mutability config of tokendata fields */
    mutability_config: boolean[];
    constructor(collection: string, description: string, name: string, maximum: number, supply: number, uri: string, default_properties: any, mutability_config: boolean[]);
}
export interface TokenDataId {
    /** Token creator address */
    creator: string;
    /** Unique name within this creator's account for this Token's collection */
    collection: string;
    /** Name of Token */
    name: string;
}
export interface TokenId {
    token_data_id: TokenDataId;
    /** version number of the property map */
    property_version: string;
}
/** server will return string for u64 */
declare type U64 = string;
export declare class Token {
    id: TokenId;
    /** server will return string for u64 */
    amount: U64;
    /** the property map of the token */
    token_properties: PropertyMap;
    constructor(id: TokenId, amount: U64, token_properties: any);
}
//# sourceMappingURL=token_types.d.ts.map