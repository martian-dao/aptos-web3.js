"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeCache = require("node-cache");
const cache = new NodeCache({
    stdTTL: 2 * 60 * 60,
    checkperiod: 0.5 * 60 * 60,
});
exports.default = cache;
//# sourceMappingURL=cache.js.map