"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-len */
const hex_string_1 = require("../../hex_string");
const ed25519_1 = require("./ed25519");
const multi_ed25519_1 = require("./multi_ed25519");
describe('MultiEd25519', () => {
    it('public key serializes to bytes correctly', async () => {
        const publicKey1 = 'b9c6ee1630ef3e711144a648db06bbb2284f7274cfbee53ffcee503cc1a49200';
        const publicKey2 = 'aef3f4a4b8eca1dfc343361bf8e436bd42de9259c04b8314eb8e2054dd6e82ab';
        const publicKey3 = '8a5762e21ac1cdb3870442c77b4c3af58c7cedb8779d0270e6d4f1e2f7367d74';
        const pubKeyMultiSig = new multi_ed25519_1.MultiEd25519PublicKey([
            new ed25519_1.Ed25519PublicKey(new hex_string_1.HexString(publicKey1).toUint8Array()),
            new ed25519_1.Ed25519PublicKey(new hex_string_1.HexString(publicKey2).toUint8Array()),
            new ed25519_1.Ed25519PublicKey(new hex_string_1.HexString(publicKey3).toUint8Array()),
        ], 2);
        expect(hex_string_1.HexString.fromUint8Array(pubKeyMultiSig.toBytes()).noPrefix()).toEqual('b9c6ee1630ef3e711144a648db06bbb2284f7274cfbee53ffcee503cc1a49200aef3f4a4b8eca1dfc343361bf8e436bd42de9259c04b8314eb8e2054dd6e82ab8a5762e21ac1cdb3870442c77b4c3af58c7cedb8779d0270e6d4f1e2f7367d7402');
    });
    it('signature serializes to bytes correctly', async () => {
        // eslint-disable-next-line operator-linebreak
        const sig1 = 'e6f3ba05469b2388492397840183945d4291f0dd3989150de3248e06b4cefe0ddf6180a80a0f04c045ee8f362870cb46918478cd9b56c66076f94f3efd5a8805';
        // eslint-disable-next-line operator-linebreak
        const sig2 = '2ae0818b7e51b853f1e43dc4c89a1f5fabc9cb256030a908f9872f3eaeb048fb1e2b4ffd5a9d5d1caedd0c8b7d6155ed8071e913536fa5c5a64327b6f2d9a102';
        const bitmap = 'c0000000';
        const multisig = new multi_ed25519_1.MultiEd25519Signature([
            new ed25519_1.Ed25519Signature(new hex_string_1.HexString(sig1).toUint8Array()),
            new ed25519_1.Ed25519Signature(new hex_string_1.HexString(sig2).toUint8Array()),
        ], new hex_string_1.HexString(bitmap).toUint8Array());
        expect(hex_string_1.HexString.fromUint8Array(multisig.toBytes()).noPrefix()).toEqual('e6f3ba05469b2388492397840183945d4291f0dd3989150de3248e06b4cefe0ddf6180a80a0f04c045ee8f362870cb46918478cd9b56c66076f94f3efd5a88052ae0818b7e51b853f1e43dc4c89a1f5fabc9cb256030a908f9872f3eaeb048fb1e2b4ffd5a9d5d1caedd0c8b7d6155ed8071e913536fa5c5a64327b6f2d9a102c0000000');
    });
    it('creates a valid bitmap', () => {
        expect(multi_ed25519_1.MultiEd25519Signature.createBitmap([0, 2, 31])).toEqual(new Uint8Array([0b10100000, 0b00000000, 0b00000000, 0b00000001]));
    });
    it('throws exception when creating a bitmap with wrong bits', async () => {
        expect(() => {
            multi_ed25519_1.MultiEd25519Signature.createBitmap([32]);
        }).toThrow('Invalid bit value 32.');
    });
    it('throws exception when creating a bitmap with duplicate bits', async () => {
        expect(() => {
            multi_ed25519_1.MultiEd25519Signature.createBitmap([2, 2]);
        }).toThrow('Duplicated bits detected.');
    });
});
//# sourceMappingURL=multi_ed25519.test.js.map