"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const property_map_serde_1 = require("../../utils/property_map_serde");
const bcs_1 = require("../../bcs");
const aptos_types_1 = require("../../aptos_types");
const utils_1 = require("../../utils");
test("test property_map_serializer", () => {
    function isSame(array1, array2) {
        return array1.length === array2.length && array1.every((element, index) => element === array2[index]);
    }
    const values = [
        "false",
        "10",
        "18446744073709551615",
        "340282366920938463463374607431768211455",
        "hello",
        "0x1",
        "I am a string",
    ];
    const types = ["bool", "u8", "u64", "u128", "0x1::string::String", "address", "string"];
    const newValues = (0, property_map_serde_1.getPropertyValueRaw)(values, types);
    expect(isSame(newValues[0], (0, bcs_1.bcsSerializeBool)(false))).toBe(true);
    expect(isSame(newValues[1], (0, bcs_1.bcsSerializeU8)(10))).toBe(true);
    expect(isSame(newValues[2], (0, bcs_1.bcsSerializeUint64)(18446744073709551615n))).toBe(true);
    expect(isSame(newValues[3], (0, bcs_1.bcsSerializeU128)(340282366920938463463374607431768211455n))).toBe(true);
    expect(isSame(newValues[4], (0, bcs_1.bcsSerializeStr)(values[4]))).toBe(true);
    expect(isSame(newValues[5], (0, bcs_1.bcsToBytes)(aptos_types_1.AccountAddress.fromHex(new utils_1.HexString("0x1"))))).toBe(true);
});
test("test propertymap deserializer", () => {
    function toHexString(data) {
        return utils_1.HexString.fromUint8Array(data).hex();
    }
    const values = [
        "false",
        "10",
        "18446744073709551615",
        "340282366920938463463374607431768211455",
        "hello",
        "0x0000000000000000000000000000000000000000000000000000000000000001",
        "I am a string",
    ];
    const types = ["bool", "u8", "u64", "u128", "0x1::string::String", "address", "string"];
    const newValues = (0, property_map_serde_1.getPropertyValueRaw)(values, types);
    for (let i = 0; i < values.length; i += 1) {
        expect((0, property_map_serde_1.deserializeValueBasedOnTypeTag)((0, property_map_serde_1.getPropertyType)(types[i]), toHexString(newValues[i]))).toBe(values[i]);
    }
});
//# sourceMappingURL=property_map_serde.test.js.map