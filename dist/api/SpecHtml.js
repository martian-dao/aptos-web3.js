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
exports.SpecHtml = void 0;
class SpecHtml {
    constructor(http) {
        /**
         * No description
         *
         * @tags general
         * @name GetSpecHtml
         * @summary API document
         * @request GET:/spec.html
         */
        this.getSpecHtml = (params = {}) => this.http.request({
            path: `/spec.html`,
            method: "GET",
            ...params,
        });
        this.http = http;
    }
}
exports.SpecHtml = SpecHtml;
//# sourceMappingURL=SpecHtml.js.map