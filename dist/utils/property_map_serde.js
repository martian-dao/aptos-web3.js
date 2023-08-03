"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeValueBasedOnTypeTag = exports.deserializePropertyMap = exports.getSinglePropertyValueRaw = exports.getPropertyValueRaw = exports.getPropertyType = exports.PropertyMap = exports.PropertyValue = void 0;
const bcs_1 = require("../bcs");
const builder_utils_1 = require("../transaction_builder/builder_utils");
const aptos_types_1 = require("../aptos_types");
const hex_string_1 = require("./hex_string");
class PropertyValue {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
exports.PropertyValue = PropertyValue;
class PropertyMap {
    constructor() {
        this.data = {};
    }
    setProperty(key, value) {
        this.data[key] = value;
    }
}
exports.PropertyMap = PropertyMap;
function getPropertyType(typ) {
    let typeTag;
    if (typ === "string" || typ === "String") {
        typeTag = new aptos_types_1.TypeTagStruct(aptos_types_1.stringStructTag);
    }
    else {
        typeTag = new aptos_types_1.TypeTagParser(typ).parseTypeTag();
    }
    return typeTag;
}
exports.getPropertyType = getPropertyType;
function getPropertyValueRaw(values, types) {
    if (values.length !== types.length) {
        throw new Error("Length of property values and types not match");
    }
    const results = new Array();
    types.forEach((typ, index) => {
        try {
            const typeTag = getPropertyType(typ);
            const serializer = new bcs_1.Serializer();
            (0, builder_utils_1.serializeArg)(values[index], typeTag, serializer);
            results.push(serializer.getBytes());
        }
        catch (error) {
            // if not support type, just use the raw string bytes
            results.push(new TextEncoder().encode(values[index]));
        }
    });
    return results;
}
exports.getPropertyValueRaw = getPropertyValueRaw;
function getSinglePropertyValueRaw(value, type) {
    if (!value || !type) {
        throw new Error("value or type can not be empty");
    }
    try {
        const typeTag = getPropertyType(type);
        const serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(value, typeTag, serializer);
        return serializer.getBytes();
    }
    catch (error) {
        // if not support type, just use the raw string bytes
        return new TextEncoder().encode(value);
    }
}
exports.getSinglePropertyValueRaw = getSinglePropertyValueRaw;
function deserializePropertyMap(rawPropertyMap) {
    const entries = rawPropertyMap.map.data;
    const pm = new PropertyMap();
    entries.forEach((prop) => {
        const { key } = prop;
        const val = prop.value.value;
        const typ = prop.value.type;
        const typeTag = getPropertyType(typ);
        const newValue = deserializeValueBasedOnTypeTag(typeTag, val);
        const pv = new PropertyValue(typ, newValue);
        pm.setProperty(key, pv);
    });
    return pm;
}
exports.deserializePropertyMap = deserializePropertyMap;
function deserializeValueBasedOnTypeTag(tag, val) {
    const de = new bcs_1.Deserializer(new hex_string_1.HexString(val).toUint8Array());
    let res = "";
    if (tag instanceof aptos_types_1.TypeTagU8) {
        res = de.deserializeU8().toString();
    }
    else if (tag instanceof aptos_types_1.TypeTagU64) {
        res = de.deserializeU64().toString();
    }
    else if (tag instanceof aptos_types_1.TypeTagU128) {
        res = de.deserializeU128().toString();
    }
    else if (tag instanceof aptos_types_1.TypeTagBool) {
        res = de.deserializeBool() ? "true" : "false";
    }
    else if (tag instanceof aptos_types_1.TypeTagAddress) {
        res = hex_string_1.HexString.fromUint8Array(de.deserializeFixedBytes(32)).hex();
    }
    else if (tag instanceof aptos_types_1.TypeTagStruct && tag.isStringTypeTag()) {
        res = de.deserializeStr();
    }
    else {
        res = val;
    }
    return res;
}
exports.deserializeValueBasedOnTypeTag = deserializeValueBasedOnTypeTag;
//# sourceMappingURL=property_map_serde.js.map