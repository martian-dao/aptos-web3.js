"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aptosRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const fetchAdapter = require("./fetch-adapter");
const version_1 = require("../version");
const types_1 = require("./types");
require("./cookieJar");
/**
 * Meaningful errors map
 */
const errors = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
};
/**
 * Given a url and method, sends the request with axios and
 * returns the response.
 */
async function axiosRequest(url, method, body, contentType, params, overrides) {
    const headers = {
        ...overrides?.HEADERS,
        "x-aptos-client": `aptos-ts-sdk/${version_1.VERSION}`,
        "content-type": contentType ?? "application/json",
    };
    if (overrides?.TOKEN) {
        headers.Authorization = `Bearer ${overrides?.TOKEN}`;
    }
    const requestConfig = {
        headers,
        method,
        url,
        params,
        data: body,
        withCredentials: overrides?.WITH_CREDENTIALS ?? true,
        adapter: fetchAdapter,
    };
    try {
        return await (0, axios_1.default)(requestConfig);
    }
    catch (error) {
        const axiosError = error;
        if (axiosError.response) {
            return axiosError.response;
        }
        throw error;
    }
}
/**
 * The main function to use when doing an API request.
 * Wraps axios error response with AptosApiError
 *
 * @param options AptosRequest
 * @returns the response or AptosApiError
 */
async function aptosRequest(options) {
    const { url, endpoint, method, body, contentType, params, overrides } = options;
    const fullEndpoint = `${url}/${endpoint ?? ""}`;
    const response = await axiosRequest(fullEndpoint, method, body, contentType, params, overrides);
    const result = {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
        config: response.config,
        url: fullEndpoint,
    };
    if (response.status >= 200 && response.status < 300) {
        return result;
    }
    const errorMessage = errors[response.status];
    throw new types_1.AptosApiError(options, result, errorMessage ?? "Generic Error");
}
exports.aptosRequest = aptosRequest;
//# sourceMappingURL=core.js.map