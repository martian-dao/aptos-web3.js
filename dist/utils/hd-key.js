"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.derivePath = exports.isValidPath = exports.getPublicKey = exports.CKDPriv = exports.getMasterKeyFromSeed = void 0;
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const hmac_1 = require("@noble/hashes/hmac");
const sha512_1 = require("@noble/hashes/sha512");
const utils_1 = require("@noble/hashes/utils");
const pathRegex = /^m(\/[0-9]+')+$/;
const replaceDerive = (val) => val.replace("'", "");
const HMAC_KEY = "ed25519 seed";
const HARDENED_OFFSET = 0x80000000;
const getMasterKeyFromSeed = (seed) => {
    const h = hmac_1.hmac.create(sha512_1.sha512, HMAC_KEY);
    const I = h.update((0, utils_1.hexToBytes)(seed)).digest();
    const IL = I.slice(0, 32);
    const IR = I.slice(32);
    return {
        key: IL,
        chainCode: IR,
    };
};
exports.getMasterKeyFromSeed = getMasterKeyFromSeed;
const CKDPriv = ({ key, chainCode }, index) => {
    const buffer = new ArrayBuffer(4);
    new DataView(buffer).setUint32(0, index);
    const indexBytes = new Uint8Array(buffer);
    const zero = new Uint8Array([0]);
    const data = new Uint8Array([...zero, ...key, ...indexBytes]);
    const I = hmac_1.hmac.create(sha512_1.sha512, chainCode).update(data).digest();
    const IL = I.slice(0, 32);
    const IR = I.slice(32);
    return {
        key: IL,
        chainCode: IR,
    };
};
exports.CKDPriv = CKDPriv;
const getPublicKey = (privateKey, withZeroByte = true) => {
    const keyPair = tweetnacl_1.default.sign.keyPair.fromSeed(privateKey);
    const signPk = keyPair.secretKey.subarray(32);
    const zero = new Uint8Array([0]);
    return withZeroByte ? new Uint8Array([...zero, ...signPk]) : signPk;
};
exports.getPublicKey = getPublicKey;
const isValidPath = (path) => {
    if (!pathRegex.test(path)) {
        return false;
    }
    return !path
        .split("/")
        .slice(1)
        .map(replaceDerive)
        .some(Number.isNaN);
};
exports.isValidPath = isValidPath;
const derivePath = (path, seed, offset = HARDENED_OFFSET) => {
    if (!(0, exports.isValidPath)(path)) {
        throw new Error("Invalid derivation path");
    }
    const { key, chainCode } = (0, exports.getMasterKeyFromSeed)(seed);
    const segments = path
        .split("/")
        .slice(1)
        .map(replaceDerive)
        .map((el) => parseInt(el, 10));
    return segments.reduce((parentKeys, segment) => (0, exports.CKDPriv)(parentKeys, segment + offset), { key, chainCode });
};
exports.derivePath = derivePath;
//# sourceMappingURL=hd-key.js.map