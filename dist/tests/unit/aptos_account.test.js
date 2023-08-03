"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = require("../../account");
const utils_1 = require("../../utils");
const aptosAccountObject = {
    address: "0x978c213990c4833df71548df7ce49d54c759d6b6d932de22b24d56060b7af2aa",
    privateKeyHex: 
    // eslint-disable-next-line max-len
    "0xc5338cd251c22daa8c9c9cc94f498cc8a5c7e1d2e75287a5dda91096fe64efa5de19e5d1880cac87d57484ce9ed2e84cf0f9599f12e7cc3a52e4e7657a763f2c",
    publicKeyHex: "0xde19e5d1880cac87d57484ce9ed2e84cf0f9599f12e7cc3a52e4e7657a763f2c",
};
const mnemonic = "shoot island position soft burden budget tooth cruel issue economy destroy above";
test("generates random accounts", () => {
    const a1 = new account_1.AptosAccount();
    const a2 = new account_1.AptosAccount();
    expect(a1.authKey()).not.toBe(a2.authKey());
    expect(a1.address().hex()).not.toBe(a2.address().hex());
});
test("generates derive path accounts", () => {
    const address = "0x07968dab936c1bad187c60ce4082f307d030d780e91e694ae03aef16aba73f30";
    const a1 = account_1.AptosAccount.fromDerivePath("m/44'/637'/0'/0'/0'", mnemonic);
    expect(a1.address().hex()).toBe(address);
});
test("generates derive path accounts", () => {
    expect(() => {
        account_1.AptosAccount.fromDerivePath("", mnemonic);
    }).toThrow(new Error("Invalid derivation path"));
});
test("accepts custom address", () => {
    const address = "0x777";
    const a1 = new account_1.AptosAccount(undefined, address);
    expect(a1.address().hex()).toBe(address);
});
test("Deserializes from AptosAccountObject", () => {
    const a1 = account_1.AptosAccount.fromAptosAccountObject(aptosAccountObject);
    expect(a1.address().hex()).toBe(aptosAccountObject.address);
    expect(a1.pubKey().hex()).toBe(aptosAccountObject.publicKeyHex);
});
test("Deserializes from AptosAccountObject without address", () => {
    const privateKeyObject = { privateKeyHex: aptosAccountObject.privateKeyHex };
    const a1 = account_1.AptosAccount.fromAptosAccountObject(privateKeyObject);
    expect(a1.address().hex()).toBe(aptosAccountObject.address);
    expect(a1.pubKey().hex()).toBe(aptosAccountObject.publicKeyHex);
});
test("Serializes/Deserializes", () => {
    const a1 = new account_1.AptosAccount();
    const a2 = account_1.AptosAccount.fromAptosAccountObject(a1.toPrivateKeyObject());
    expect(a1.authKey().hex()).toBe(a2.authKey().hex());
    expect(a1.address().hex()).toBe(a2.address().hex());
});
test("Signs and verifies strings", () => {
    const a1 = account_1.AptosAccount.fromAptosAccountObject(aptosAccountObject);
    const messageHex = "0x7777";
    const expectedSignedMessage = "0xc5de9e40ac00b371cd83b1c197fa5b665b7449b33cd3cdd305bb78222e06a671a49625ab9aea8a039d4bb70e275768084d62b094bc1b31964f2357b7c1af7e0d";
    expect(a1.signHexString(messageHex).hex()).toBe(expectedSignedMessage);
    expect(a1.verifySignature(messageHex, expectedSignedMessage)).toBe(true);
    expect(a1.verifySignature(messageHex + "00", expectedSignedMessage)).toBe(false);
});
test("Gets the resource account address", () => {
    const sourceAddress = "0xca843279e3427144cead5e4d5999a3d0";
    const seed = new Uint8Array([1]);
    expect(account_1.AptosAccount.getResourceAccountAddress(sourceAddress, seed).hex()).toBe("0xcbed05b37b6981a57f535c1f5d136734df822abaf4cd30c51c9b4d60eae79d5d");
});
test("Test getAddressFromAccountOrAddress", () => {
    const account = account_1.AptosAccount.fromAptosAccountObject(aptosAccountObject);
    expect((0, account_1.getAddressFromAccountOrAddress)(aptosAccountObject.address).toString()).toBe(aptosAccountObject.address);
    expect((0, account_1.getAddressFromAccountOrAddress)(utils_1.HexString.ensure(aptosAccountObject.address)).toString()).toBe(aptosAccountObject.address);
    expect((0, account_1.getAddressFromAccountOrAddress)(account).toString()).toBe(aptosAccountObject.address);
});
test("Gets the collection id", async () => {
    const creatorAddress = "0x28aa1624f8a8974c4158da696eea0e1c26af2cf7cacdb3564193ae817a44f908";
    const collectionName = "AliceCollection";
    expect(account_1.AptosAccount.getCollectionID(creatorAddress, collectionName).hex()).toBe("0x0524ffd0955d9c8c405315829ce896f5ced080cd15f146bbc690323d4d141b12");
});
//# sourceMappingURL=aptos_account.test.js.map