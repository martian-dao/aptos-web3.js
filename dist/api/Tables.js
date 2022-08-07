"use strict";
/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tables = void 0;
const http_client_1 = require("./http-client");
class Tables {
    constructor(http) {
        /**
         * @description Gets a table item for a table identified by the handle and the key for the item. Key and value types need to be passed in to help with key serialization and value deserialization.
         *
         * @tags state, table
         * @name GetTableItem
         * @summary Get table item by handle and key.
         * @request POST:/tables/{table_handle}/item
         */
        this.getTableItem = (tableHandle, data, params = {}) => this.http.request({
            path: `/tables/${tableHandle}/item`,
            method: "POST",
            body: data,
            type: http_client_1.ContentType.Json,
            format: "json",
            ...params,
        });
        this.http = http;
    }
}
exports.Tables = Tables;
//# sourceMappingURL=Tables.js.map