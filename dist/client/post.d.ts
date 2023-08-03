import { AptosRequest, AptosResponse } from "./types";
export declare type PostRequestOptions = Omit<AptosRequest, "method">;
/**
 * Main function to do a Post request
 *
 * @param options PostRequestOptions
 * @returns
 */
export declare function post<Req, Res>(options: PostRequestOptions): Promise<AptosResponse<Req, Res>>;
//# sourceMappingURL=post.d.ts.map