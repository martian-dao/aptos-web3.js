import { Provider, OptionalTransactionArgs } from "../providers";
import * as Gen from "../generated/index";
import { AptosAccount } from "../account";
export declare class AnsClient {
    contractAddress: string;
    provider: Provider;
    /**
     * Creates new AnsClient instance
     * @param provider Provider instance
     * @param contractAddress An optional contract address.
     * If there is no contract address matching to the provided network
     * then the AnsClient class expects a contract address -
     * this is to support both mainnet/testnet networks and local development.
     */
    constructor(provider: Provider, contractAddress?: string);
    /**
     * Returns the primary name for the given account address
     * @param address An account address
     * @returns Account's primary name | null if there is no primary name defined
     */
    getPrimaryNameByAddress(address: string): Promise<string | null>;
    /**
     * Returns the target account address for the given name
     * @param name ANS name
     * @returns Account address | null
     */
    getAddressByName(name: string): Promise<string | null>;
    /**
     * Mint a new Aptos name
     *
     * @param account AptosAccount where collection will be created
     * @param domainName Aptos domain name to mint
     * @param years year duration of the domain name
     * @returns The hash of the pending transaction submitted to the API
     */
    mintAptosName(account: AptosAccount, domainName: string, years?: number, extraArgs?: OptionalTransactionArgs): Promise<Gen.HashValue>;
    /**
     * Mint a new Aptos Subdomain
     *
     * @param account AptosAccount the owner of the domain name
     * @param subdomainName subdomain name to mint
     * @param domainName Aptos domain name to mint under
     * @param expirationTimestampSeconds must be set between the domains expiration and the current time
     * @returns The hash of the pending transaction submitted to the API
     */
    mintAptosSubdomain(account: AptosAccount, subdomainName: string, domainName: string, expirationTimestampSeconds?: number, extraArgs?: OptionalTransactionArgs): Promise<Gen.HashValue>;
    /**
     * @param account AptosAccount the owner of the domain name
     * @param subdomainName subdomain name to mint
     * @param domainName Aptos domain name to mint
     * @param target the target address for the subdomain
     * @returns The hash of the pending transaction submitted to the API
     */
    setSubdomainAddress(account: AptosAccount, subdomainName: string, domainName: string, target: string, extraArgs?: OptionalTransactionArgs): Promise<Gen.HashValue>;
    /**
     * Initialize reverse lookup for contract owner
     *
     * @param owner the `aptos_names` AptosAccount
     * @returns The hash of the pending transaction submitted to the API
     */
    initReverseLookupRegistry(owner: AptosAccount, extraArgs?: OptionalTransactionArgs): Promise<Gen.HashValue>;
    /**
     * Returns the AnsRegistry for the given domain name
     * @param domain domain name
     * @example
     * if name is `aptos.apt`
     * domain = aptos
     *
     * @returns AnsRegistry | null
     */
    private getRegistrationForDomainName;
    /**
     * Returns the AnsRegistry for the given subdomain_name
     * @param domain domain name
     * @param subdomain subdomain name
     * @example
     * if name is `dev.aptos.apt`
     * domain = aptos
     * subdomain = dev
     *
     * @returns AnsRegistry | null
     */
    private getRegistrationForSubdomainName;
}
//# sourceMappingURL=ans_client.d.ts.map