"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_U128_BIG_INT = exports.MAX_U64_BIG_INT = exports.MAX_U32_NUMBER = exports.MAX_U16_NUMBER = exports.MAX_U8_NUMBER = void 0;
// Upper bound values for uint8, uint16, uint64 and uint128
exports.MAX_U8_NUMBER = 2 ** 8 - 1;
exports.MAX_U16_NUMBER = 2 ** 16 - 1;
exports.MAX_U32_NUMBER = 2 ** 32 - 1;
exports.MAX_U64_BIG_INT = BigInt(2 ** 64) - 1n;
exports.MAX_U128_BIG_INT = BigInt(2 ** 128) - 1n;
//# sourceMappingURL=consts.js.map