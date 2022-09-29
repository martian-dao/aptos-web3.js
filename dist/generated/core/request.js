"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fetchAdapter = require("./fetch-adapter");
const ApiError_1 = require("./ApiError");
const CancelablePromise_1 = require("./CancelablePromise");
class CookieJar {
    constructor(jar = new Map()) {
        this.jar = jar;
    }
    setCookie(url, cookieStr) {
        const key = url.origin.toLowerCase();
        if (!this.jar.has(key)) {
            this.jar.set(key, []);
        }
        const cookie = CookieJar.parse(cookieStr);
        this.jar.set(key, [...(this.jar.get(key)?.filter((c) => c.name !== cookie.name) || []), cookie]);
    }
    getCookies(url) {
        const key = url.origin.toLowerCase();
        if (!this.jar.get(key)) {
            return [];
        }
        // Filter out expired cookies
        return this.jar.get(key)?.filter((cookie) => !cookie.expires || cookie.expires > new Date()) || [];
    }
    static parse(str) {
        if (typeof str !== "string") {
            throw new Error("argument str must be a string");
        }
        const parts = str.split(";").map((part) => part.trim());
        let cookie;
        if (parts.length > 0) {
            const [name, value] = parts[0].split("=");
            if (!name || !value) {
                throw new Error("Invalid cookie");
            }
            cookie = {
                name,
                value,
            };
        }
        else {
            throw new Error("Invalid cookie");
        }
        parts.slice(1).forEach((part) => {
            const [name, value] = part.split("=");
            if (!name.trim()) {
                throw new Error("Invalid cookie");
            }
            const nameLow = name.toLowerCase();
            // eslint-disable-next-line quotes
            const val = value?.charAt(0) === "'" || value?.charAt(0) === '"' ? value?.slice(1, -1) : value;
            if (nameLow === "expires") {
                cookie.expires = new Date(val);
            }
            if (nameLow === "path") {
                cookie.path = val;
            }
            if (nameLow === "samesite") {
                if (val !== "Lax" && val !== "None" && val !== "Strict") {
                    throw new Error("Invalid cookie SameSite value");
                }
                cookie.sameSite = val;
            }
            if (nameLow === "secure") {
                cookie.secure = true;
            }
        });
        return cookie;
    }
}
const jar = new CookieJar();
axios_1.default.interceptors.response.use((response) => {
    if (Array.isArray(response.headers["set-cookie"])) {
        response.headers["set-cookie"].forEach((c) => {
            jar.setCookie(new URL(response.config.url), c);
        });
    }
    return response;
});
axios_1.default.interceptors.request.use(function (config) {
    const cookies = jar.getCookies(new URL(config.url));
    if (cookies?.length > 0) {
        config.headers.cookie = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
    }
    return config;
});
const isDefined = (value) => {
    return value !== undefined && value !== null;
};
const isString = (value) => {
    return typeof value === 'string';
};
const isStringWithValue = (value) => {
    return isString(value) && value !== '';
};
const isBlob = (value) => {
    return (typeof value === 'object' &&
        typeof value.type === 'string' &&
        typeof value.stream === 'function' &&
        typeof value.arrayBuffer === 'function' &&
        typeof value.constructor === 'function' &&
        typeof value.constructor.name === 'string' &&
        /^(Blob|File)$/.test(value.constructor.name) &&
        /^(Blob|File)$/.test(value[Symbol.toStringTag]));
};
const isFormData = (value) => {
    return value instanceof form_data_1.default;
};
const isSuccess = (status) => {
    return status >= 200 && status < 300;
};
const base64 = (str) => { return btoa(str); };
const getQueryString = (params) => {
    const qs = [];
    const append = (key, value) => {
        qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    };
    const process = (key, value) => {
        if (isDefined(value)) {
            if (Array.isArray(value)) {
                value.forEach(v => {
                    process(key, v);
                });
            }
            else if (typeof value === 'object') {
                Object.entries(value).forEach(([k, v]) => {
                    process(`${key}[${k}]`, v);
                });
            }
            else {
                append(key, value);
            }
        }
    };
    Object.entries(params).forEach(([key, value]) => {
        process(key, value);
    });
    if (qs.length > 0) {
        return `?${qs.join('&')}`;
    }
    return '';
};
const getUrl = (config, options) => {
    const encoder = config.ENCODE_PATH || encodeURI;
    const path = options.url
        .replace('{api-version}', config.VERSION)
        .replace(/{(.*?)}/g, (substring, group) => {
        if (options.path?.hasOwnProperty(group)) {
            return encoder(String(options.path[group]));
        }
        return substring;
    });
    const url = `${config.BASE}${path}`;
    if (options.query) {
        return `${url}${getQueryString(options.query)}`;
    }
    return url;
};
const getFormData = (options) => {
    if (options.formData) {
        const formData = new form_data_1.default();
        const process = (key, value) => {
            if (isString(value) || isBlob(value)) {
                formData.append(key, value);
            }
            else {
                formData.append(key, JSON.stringify(value));
            }
        };
        Object.entries(options.formData)
            .filter(([_, value]) => isDefined(value))
            .forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => process(key, v));
            }
            else {
                process(key, value);
            }
        });
        return formData;
    }
    return undefined;
};
const resolve = async (options, resolver) => {
    if (typeof resolver === 'function') {
        return resolver(options);
    }
    return resolver;
};
const getHeaders = async (config, options, formData) => {
    const token = await resolve(options, config.TOKEN);
    const username = await resolve(options, config.USERNAME);
    const password = await resolve(options, config.PASSWORD);
    const additionalHeaders = await resolve(options, config.HEADERS);
    const formHeaders = typeof formData?.getHeaders === 'function' && formData?.getHeaders() || {};
    const headers = Object.entries({
        Accept: 'application/json',
        ...additionalHeaders,
        ...options.headers,
        ...formHeaders,
    })
        .filter(([_, value]) => isDefined(value))
        .reduce((headers, [key, value]) => ({
        ...headers,
        [key]: String(value),
    }), {});
    if (isStringWithValue(token)) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if (isStringWithValue(username) && isStringWithValue(password)) {
        const credentials = base64(`${username}:${password}`);
        headers['Authorization'] = `Basic ${credentials}`;
    }
    if (options.body) {
        if (options.mediaType) {
            headers['Content-Type'] = options.mediaType;
        }
        else if (isBlob(options.body)) {
            headers['Content-Type'] = options.body.type || 'application/octet-stream';
        }
        else if (isString(options.body)) {
            headers['Content-Type'] = 'text/plain';
        }
        else if (!isFormData(options.body)) {
            headers['Content-Type'] = 'application/json';
        }
    }
    return headers;
};
const getRequestBody = (options) => {
    if (options.body) {
        return options.body;
    }
    return undefined;
};
const sendRequest = async (config, options, url, body, formData, headers, onCancel) => {
    const source = axios_1.default.CancelToken.source();
    const requestConfig = {
        url,
        headers,
        data: body ?? formData,
        method: options.method,
        withCredentials: config.WITH_CREDENTIALS,
        cancelToken: source.token,
        adapter: fetchAdapter
    };
    const isBCS = Object.keys(config.HEADERS || {})
        .filter((k) => k.toLowerCase() === "accept")
        .map((k) => config.HEADERS[k])
        .includes("application/x-bcs");
    if (isBCS) {
        requestConfig.responseType = "arraybuffer";
    }
    onCancel(() => source.cancel('The user aborted a request.'));
    try {
        return await axios_1.default.request(requestConfig);
    }
    catch (error) {
        const axiosError = error;
        if (axiosError.response) {
            return axiosError.response;
        }
        throw error;
    }
};
const getResponseHeader = (response, responseHeader) => {
    if (responseHeader) {
        const content = response.headers[responseHeader];
        if (isString(content)) {
            return content;
        }
    }
    return undefined;
};
const getResponseBody = (response) => {
    if (response.status !== 204) {
        return response.data;
    }
    return undefined;
};
const catchErrorCodes = (options, result) => {
    const errors = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        ...options.errors,
    };
    const error = errors[result.status];
    if (error) {
        throw new ApiError_1.ApiError(options, result, error);
    }
    if (!result.ok) {
        throw new ApiError_1.ApiError(options, result, 'Generic Error');
    }
};
/**
 * Request method
 * @param config The OpenAPI configuration object
 * @param options The request options from the service
 * @returns CancelablePromise<T>
 * @throws ApiError
 */
const request = (config, options) => {
    return new CancelablePromise_1.CancelablePromise(async (resolve, reject, onCancel) => {
        try {
            const url = getUrl(config, options);
            const formData = getFormData(options);
            const body = getRequestBody(options);
            const headers = await getHeaders(config, options, formData);
            if (!onCancel.isCancelled) {
                const response = await sendRequest(config, options, url, body, formData, headers, onCancel);
                const responseBody = getResponseBody(response);
                const responseHeader = getResponseHeader(response, options.responseHeader);
                const result = {
                    url,
                    ok: isSuccess(response.status),
                    status: response.status,
                    statusText: response.statusText,
                    body: responseHeader ?? responseBody,
                };
                catchErrorCodes(options, result);
                resolve(result.body);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.request = request;
//# sourceMappingURL=request.js.map