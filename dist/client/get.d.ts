import { AptosRequest, AptosResponse } from "./types";
export declare type GetRequestOptions = Omit<AptosRequest, "body" | "method">;
/**
 * Main function to do a Get request
 *
 * @param options GetRequestOptions
 * @returns
 */
export declare function get<Req, Res>(options: GetRequestOptions): Promise<AptosResponse<Req, Res>>;
//# sourceMappingURL=get.d.ts.map