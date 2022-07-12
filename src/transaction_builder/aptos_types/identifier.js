"use strict";
exports.__esModule = true;
exports.Identifier = void 0;
var Identifier = /** @class */ (function () {
    function Identifier(value) {
        this.value = value;
    }
    Identifier.prototype.serialize = function (serializer) {
        serializer.serializeStr(this.value);
    };
    Identifier.deserialize = function (deserializer) {
        var value = deserializer.deserializeStr();
        return new Identifier(value);
    };
    return Identifier;
}());
exports.Identifier = Identifier;
