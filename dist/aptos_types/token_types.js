"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.TokenData = exports.PropertyValue = exports.PropertyMap = void 0;
const property_map_serde_1 = require("../utils/property_map_serde");
Object.defineProperty(exports, "PropertyMap", { enumerable: true, get: function () { return property_map_serde_1.PropertyMap; } });
Object.defineProperty(exports, "PropertyValue", { enumerable: true, get: function () { return property_map_serde_1.PropertyValue; } });
class TokenData {
    constructor(collection, description, name, maximum, supply, uri, default_properties, mutability_config) {
        this.collection = collection;
        this.description = description;
        this.name = name;
        this.maximum = maximum;
        this.supply = supply;
        this.uri = uri;
        this.default_properties = (0, property_map_serde_1.deserializePropertyMap)(default_properties);
        this.mutability_config = mutability_config;
    }
}
exports.TokenData = TokenData;
class Token {
    constructor(id, amount, token_properties) {
        this.id = id;
        this.amount = amount;
        this.token_properties = (0, property_map_serde_1.deserializePropertyMap)(token_properties);
    }
}
exports.Token = Token;
//# sourceMappingURL=token_types.js.map