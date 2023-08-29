import { ClientConfig } from "../client";
export declare function paginateWithCursor<Req extends Record<string, any>, Res extends any[]>(options: {
    url: string;
    endpoint?: string;
    body?: any;
    params?: Req;
    originMethod?: string;
    overrides?: ClientConfig;
}): Promise<Res>;
//# sourceMappingURL=pagination_helpers.d.ts.map