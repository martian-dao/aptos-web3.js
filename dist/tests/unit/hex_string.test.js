"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const withoutPrefix = "007711b4d0";
const withPrefix = `0x${withoutPrefix}`;
function validate(hexString) {
    expect(hexString.hex()).toBe(withPrefix);
    expect(hexString.toString()).toBe(withPrefix);
    expect(`${hexString}`).toBe(withPrefix);
    expect(hexString.noPrefix()).toBe(withoutPrefix);
}
test("from/to Uint8Array", () => {
    const hs = new utils_1.HexString(withoutPrefix);
    expect(utils_1.HexString.fromUint8Array(hs.toUint8Array()).hex()).toBe(withPrefix);
});
test("accepts input without prefix", () => {
    const hs = new utils_1.HexString(withoutPrefix);
    validate(hs);
});
test("accepts input with prefix", () => {
    const hs = new utils_1.HexString(withPrefix);
    validate(hs);
});
test("ensures input when string", () => {
    const hs = utils_1.HexString.ensure(withoutPrefix);
    validate(hs);
});
test("ensures input when HexString", () => {
    const hs1 = new utils_1.HexString(withPrefix);
    const hs = utils_1.HexString.ensure(hs1);
    validate(hs);
});
test("short address form correct", () => {
    const hs1 = new utils_1.HexString(withoutPrefix);
    expect(hs1.toShortString()).toBe("0x7711b4d0");
    const hs2 = new utils_1.HexString("0x2185b82cef9bc46249ff2dbc56c265f6a0e3bdb7b9498cc45e4f6e429530fdc0");
    expect(hs2.toShortString()).toBe("0x2185b82cef9bc46249ff2dbc56c265f6a0e3bdb7b9498cc45e4f6e429530fdc0");
});
//# sourceMappingURL=hex_string.test.js.map