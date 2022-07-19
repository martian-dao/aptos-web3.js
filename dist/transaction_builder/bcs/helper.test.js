"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aptos_types_1 = require("../aptos_types");
const deserializer_1 = require("./deserializer");
const helper_1 = require("./helper");
const serializer_1 = require("./serializer");
test('serializes and deserializes a vector of serializables', () => {
    const address0 = aptos_types_1.AccountAddress.fromHex('0x1');
    const address1 = aptos_types_1.AccountAddress.fromHex('0x2');
    const serializer = new serializer_1.Serializer();
    (0, helper_1.serializeVector)([address0, address1], serializer);
    const addresses = (0, helper_1.deserializeVector)(new deserializer_1.Deserializer(serializer.getBytes()), aptos_types_1.AccountAddress);
    expect(addresses[0].address).toEqual(address0.address);
    expect(addresses[1].address).toEqual(address1.address);
});
test('bcsToBytes', () => {
    const address = aptos_types_1.AccountAddress.fromHex('0x1');
    (0, helper_1.bcsToBytes)(address);
    expect((0, helper_1.bcsToBytes)(address)).toEqual(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]));
});
//# sourceMappingURL=helper.test.js.map