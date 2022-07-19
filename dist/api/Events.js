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
exports.Events = void 0;
class Events {
    constructor(http) {
        /**
         * No description
         *
         * @tags events
         * @name GetEventsByEventKey
         * @summary Get events by event key
         * @request GET:/events/{event_key}
         */
        this.getEventsByEventKey = (eventKey, params = {}) => this.http.request({
            path: `/events/${eventKey}`,
            method: "GET",
            format: "json",
            ...params,
        });
        this.http = http;
    }
}
exports.Events = Events;
//# sourceMappingURL=Events.js.map