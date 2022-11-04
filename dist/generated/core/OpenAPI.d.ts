import type { ApiRequestOptions } from './ApiRequestOptions';
declare type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
declare type Headers = Record<string, string>;
export declare type OpenAPIConfig = {
    BASE: string;
    VERSION: string;
    WITH_CREDENTIALS: boolean;
    CREDENTIALS: 'include' | 'omit' | 'same-origin';
    TOKEN?: string | Resolver<string>;
    USERNAME?: string | Resolver<string>;
    PASSWORD?: string | Resolver<string>;
    HEADERS?: Headers | Resolver<Headers>;
    ENCODE_PATH?: (path: string) => string;
};
export declare const OpenAPI: OpenAPIConfig;
export {};
//# sourceMappingURL=OpenAPI.d.ts.map