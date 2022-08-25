import type { AccountSignature } from './AccountSignature';
import type { Address } from './Address';
export declare type MultiAgentSignature = {
    sender: AccountSignature;
    secondary_signer_addresses: Array<Address>;
    secondary_signers: Array<AccountSignature>;
};
//# sourceMappingURL=MultiAgentSignature.d.ts.map