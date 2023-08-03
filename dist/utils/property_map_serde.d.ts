import { Bytes } from "../bcs";
import { TypeTag } from "../aptos_types";
export declare class PropertyValue {
    type: string;
    value: any;
    constructor(type: string, value: string);
}
export declare class PropertyMap {
    data: {
        [key: string]: PropertyValue;
    };
    constructor();
    setProperty(key: string, value: PropertyValue): void;
}
export declare function getPropertyType(typ: string): TypeTag;
export declare function getPropertyValueRaw(values: Array<string>, types: Array<string>): Array<Bytes>;
export declare function getSinglePropertyValueRaw(value: string, type: string): Uint8Array;
export declare function deserializePropertyMap(rawPropertyMap: any): PropertyMap;
export declare function deserializeValueBasedOnTypeTag(tag: TypeTag, val: string): string;
//# sourceMappingURL=property_map_serde.d.ts.map