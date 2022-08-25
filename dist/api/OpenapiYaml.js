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
exports.OpenapiYaml = void 0;
class OpenapiYaml {
    constructor(http) {
        /**
         * No description
         *
         * @tags general
         * @name GetSpecYaml
         * @summary OpenAPI specification
         * @request GET:/openapi.yaml
         */
        this.getSpecYaml = (params = {}) => this.http.request({
            path: `/openapi.yaml`,
            method: "GET",
            ...params,
        });
        this.http = http;
    }
}
exports.OpenapiYaml = OpenapiYaml;
//# sourceMappingURL=OpenapiYaml.js.map