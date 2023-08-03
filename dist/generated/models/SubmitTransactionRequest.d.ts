import { MaybeHexString } from "../../utils";
import type { Address } from "./Address";
import type { TransactionPayload } from "./TransactionPayload";
import type { TransactionSignature } from "./TransactionSignature";
import type { U64 } from "./U64";
/**
 * A request to submit a transaction
 *
 * This requires a transaction and a signature of it
 */
export declare type SubmitTransactionRequest = {
    sender: Address;
    sequence_number: U64;
    max_gas_amount: U64;
    gas_unit_price: U64;
    expiration_timestamp_secs: U64;
    payload: TransactionPayload;
    signature: TransactionSignature;
    publicKey?: MaybeHexString;
};
//# sourceMappingURL=SubmitTransactionRequest.d.ts.map