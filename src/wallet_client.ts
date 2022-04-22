import { AptosAccount } from './aptos_account';
import { TokenClient } from './token_client';
import { AptosClient } from './aptos_client';
import { FaucetClient } from './faucet_client';
import { HexString, MaybeHexString } from './hex_string';
import { Types } from './types';
import { NODE_URL, FAUCET_URL } from './util';
import * as bip39 from '@scure/bip39';
import * as english from '@scure/bip39/wordlists/english'

/** A wrapper around the Aptos-core Rest API */
export class RestClient {
    client: AptosClient
    constructor(url: string) {
        this.client = new AptosClient(url || NODE_URL);
    }

    async accountSentEvents(accountAddress: string){
        return await this.client.getEventsByEventHandle(accountAddress, "0x1::TestCoin::TransferEvents", "sent_events");
    }

    async accountReceivedEvents(accountAddress: string){
        return await this.client.getEventsByEventHandle(accountAddress, "0x1::TestCoin::TransferEvents", "received_events");
    }

    async transactionPending(txnHash: string): Promise<boolean> {
        return this.client.transactionPending(txnHash)
    }

    /** Waits up to 10 seconds for a transaction to move past pending state */
    async waitForTransaction(txnHash: string) {
        return this.client.waitForTransaction(txnHash)
    }
    
    /** Returns the test coin balance associated with the account */
    async accountBalance(accountAddress: string): Promise<number | null> {
        const resources: any = await this.client.getAccountResources(accountAddress);
        for (const key in resources) {
            const resource = resources[key];
            if (resource["type"] == "0x1::TestCoin::Balance") {
                return parseInt(resource["data"]["coin"]["value"]);
            }
        }
        return null;
    }

    /** Transfer a given coin amount from a given Account to the recipient's account address.
     Returns the sequence number of the transaction used to transfer. */
    async transfer(accountFrom: AptosAccount, recipient: string, amount: number): Promise<string> {
        const payload: { function: string; arguments: string[]; type: string; type_arguments: any[] } = {
            type: "script_function_payload",
            function: "0x1::TestCoin::transfer",
            type_arguments: [],
            arguments: [
                `${HexString.ensure(recipient)}`,
                amount.toString(),
            ]
        };
        const txnRequest = await this.client.generateTransaction(accountFrom.address(), payload);
        const signedTxn = await this.client.signTransaction(accountFrom, txnRequest);
        const res = await this.client.submitTransaction(accountFrom, signedTxn);
        return res["hash"].toString();
    }
}

function getAccountFromMnemonic(code: string, address?: MaybeHexString) {
    if (!bip39.validateMnemonic(code, english.wordlist)) {
        return Promise.reject('Incorrect mnemonic passed');
    }

    var seed = bip39.mnemonicToSeedSync(code.toString());

    const account = new AptosAccount(seed.slice(0, 32), address);
    return Promise.resolve(account);
}

export class WalletClient {
    faucetClient: FaucetClient
    restClient: RestClient
    aptosClient: AptosClient
    tokenClient: TokenClient

    constructor(url=NODE_URL){
        this.faucetClient = new FaucetClient(url, FAUCET_URL)
        this.aptosClient = new AptosClient(url)
        this.restClient = new RestClient(url)
        this.tokenClient = new TokenClient(this.aptosClient)
    }

    async createWallet() {
    
        var code = bip39.generateMnemonic(english.wordlist); // secret recovery phrase
        const account = await getAccountFromMnemonic(code).catch((msg) => {
            return Promise.reject(msg);
        });
        await this.faucetClient.fundAccount(account.authKey(), 10);
    
        return Promise.resolve({
            "code": code,
            "address key": account.address().noPrefix()
        });
    }

    async getUninitializedAccount() {
    
        var code = bip39.generateMnemonic(english.wordlist); // secret recovery phrase
        const account = await getAccountFromMnemonic(code).catch((msg) => {
            return Promise.reject(msg);
        });
    
        return Promise.resolve({
            "code": code,
            "auth_key": account.authKey(),
            "address key": account.address().noPrefix()
        });
    }
    
    async importWallet(code: string, address?: string) {
    
        const account = await getAccountFromMnemonic(code, address).catch((msg) => {
            return Promise.reject(msg);
        });
    
        await this.faucetClient.fundAccount(account.authKey(), 10);
    
        return Promise.resolve({
            "auth_key": account.authKey(),
            "address key": account.address().noPrefix()
        });
    }

    async airdrop(address: string, amount: number) {
        return await this.faucetClient.fundAccount(address, amount);
    }
    
    async getBalance(address: string) {
        var balance = await this.restClient.accountBalance(address)
        return Promise.resolve(balance);
    }
    
    async transfer(code: string, recipient_address: string, amount: number, sender_address?: string) {    
        const account = await getAccountFromMnemonic(code, sender_address).catch((msg) => {
            return Promise.reject(msg);
        });
    
        const txHash = await this.restClient.transfer(account, recipient_address, amount);
        await this.restClient.waitForTransaction(txHash).then(() => Promise.resolve(true)).catch((msg) => Promise.reject(msg));
    }
    
    async getSentEvents(address: string) {
        return await this.restClient.accountSentEvents(address)
    }
    
    async getReceivedEvents(address: string) {    
        return await this.restClient.accountReceivedEvents(address)
    }
    
    async createNFTCollection(code: string, description: string, name: string, uri: string, address?: string) {

        const account = await getAccountFromMnemonic(code, address).catch((msg) => {
            return Promise.reject(msg);
        });
    
        return await this.tokenClient.createCollection(account, description, name, uri);
    }
    
    async createNFT(code: string, collection_name: string,
        description: string, name: string, supply: number, uri: string, address?: string) {

        const account = await getAccountFromMnemonic(code, address).catch((msg) => {
            return Promise.reject(msg);
        });
    
        return await this.tokenClient.createToken(account, collection_name, description, name, supply, uri);
    }
    
    async offerNFT(code: string, receiver_address: string, creator_address: string,
        collection_name: string, token_name: string, amount: number, address?: string) {
    
        const account = await getAccountFromMnemonic(code, address).catch((msg) => {
            return Promise.reject(msg);
        });
    
        const token_id = await this.tokenClient.getTokenId(creator_address, collection_name, token_name);
    
        return await this.tokenClient.offerToken(account, receiver_address, creator_address, token_id, amount);
    }
    
    async cancelNFTOffer(code: string, receiver_address: string, creator_address: string,
        collection_name: string, token_name: string, address?: string) {

        const account = await getAccountFromMnemonic(code, address).catch((msg) => {
            return Promise.reject(msg);
        });
    
        const token_id = await this.tokenClient.getTokenId(creator_address, collection_name, token_name);
    
        return await this.tokenClient.cancelTokenOffer(account, receiver_address, creator_address, token_id);
    }
    
    async claimNFT(code: string, sender_address: string, creator_address: string,
        collection_name: string, token_name: string, address?: string) {
    
        const account = await getAccountFromMnemonic(code, address).catch((msg) => {
            return Promise.reject(msg);
        });
    
        const token_id = await this.tokenClient.getTokenId(creator_address, collection_name, token_name);
    
        return await this.tokenClient.claimToken(account, sender_address, creator_address, token_id);
    }
    
    async signGenericTransaction(code: string, func: string, address?: string, ...args: string[]) {
    
        const account = await getAccountFromMnemonic(code, address).catch((msg) => {
            return Promise.reject(msg);
        });
    
        const payload: { function: string; arguments: string[]; type: string; type_arguments: any[] } = {
            type: "script_function_payload",
            function: func,
            type_arguments: [],
            arguments: args
        }
        return await this.tokenClient.submitTransactionHelper(account, payload);
    }
    
    async getAccountResources(accountAddress: string): Promise<Types.AccountResource[]> {
        return await this.aptosClient.getAccountResources(accountAddress);
    }

    async rotateAuthKey(code: string, new_auth_key: string, currAddress?: string) {
      
        const alice = await getAccountFromMnemonic(code, currAddress).catch((msg) => {
            return Promise.reject(msg);
        });
      
        const payload: { function: string; arguments: string[]; type: string; type_arguments: any[] } = {
          type: "script_function_payload",
          function: "0x1::AptosAccount::rotate_authentication_key",
          type_arguments: [],
          arguments: [
            new_auth_key,
          ]
        }
        return await this.tokenClient.submitTransactionHelper(alice, payload);
    }
}

