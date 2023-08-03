"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
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
/* eslint-disable prefer-arrow-callback,func-names */
axios_1.default.interceptors.request.use(function (config) {
    const cookies = jar.getCookies(new URL(config.url));
    if (cookies?.length > 0 && config.headers) {
        /* eslint-disable no-param-reassign */
        config.headers.cookie = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
    }
    return config;
});
//# sourceMappingURL=cookieJar.js.map