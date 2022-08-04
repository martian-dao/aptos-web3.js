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
exports.Accounts = void 0;
class Accounts {
    constructor(http) {
        /**
         * No description
         *
         * @tags accounts, state
         * @name GetAccount
         * @summary Get account
         * @request GET:/accounts/{address}
         */
        this.getAccount = (address, params = {}) => this.http.request({
            path: `/accounts/${address}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags accounts, state
         * @name GetAccountResources
         * @summary Get account resources
         * @request GET:/accounts/{address}/resources
         */
        this.getAccountResources = (address, query, params = {}) => this.http.request({
            path: `/accounts/${address}/resources`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * @description This API renders a resource identified by the owner account `address` and the `resource_type`, at a ledger version (AKA transaction version) specified as a query param, otherwise the latest version is used.
         *
         * @tags accounts, state
         * @name GetAccountResource
         * @summary Get resource by account address and resource type.
         * @request GET:/accounts/{address}/resource/{resource_type}
         */
        this.getAccountResource = (address, resourceType, query, params = {}) => this.http.request({
            path: `/accounts/${address}/resource/${resourceType}`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags accounts, state
         * @name GetAccountModules
         * @summary Get account modules
         * @request GET:/accounts/{address}/modules
         */
        this.getAccountModules = (address, query, params = {}) => this.http.request({
            path: `/accounts/${address}/modules`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * @description This API renders a Move module identified by the module id. A module id consists of the module owner `address` and the `module_name`. The module is rendered at a ledger version (AKA transaction version) specified as a query param, otherwise the latest version is used.
         *
         * @tags accounts, state
         * @name GetAccountModule
         * @summary Get module by module id.
         * @request GET:/accounts/{address}/module/{module_name}
         */
        this.getAccountModule = (address, moduleName, query, params = {}) => this.http.request({
            path: `/accounts/${address}/module/${moduleName}`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags transactions
         * @name GetAccountTransactions
         * @summary Get account transactions
         * @request GET:/accounts/{address}/transactions
         */
        this.getAccountTransactions = (address, query, params = {}) => this.http.request({
            path: `/accounts/${address}/transactions`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * @description This API extracts event key from the account resource identified by the `event_handle_struct` and `field_name`, then returns events identified by the event key.
         *
         * @tags events
         * @name GetEventsByEventHandle
         * @summary Get events by event handle
         * @request GET:/accounts/{address}/events/{event_handle_struct}/{field_name}
         */
        this.getEventsByEventHandle = (address, eventHandleStruct, fieldName, query, params = {}) => this.http.request({
            path: `/accounts/${address}/events/${eventHandleStruct}/${fieldName}`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        this.http = http;
    }
}
exports.Accounts = Accounts;
//# sourceMappingURL=Accounts.js.map