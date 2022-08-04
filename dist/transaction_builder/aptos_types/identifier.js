"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identifier = void 0;
class Identifier {
    constructor(value) {
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeStr(this.value);
    }
    static deserialize(deserializer) {
        const value = deserializer.deserializeStr();
        return new Identifier(value);
    }
}
exports.Identifier = Identifier;
//# sourceMappingURL=identifier.js.map