// Copyright (c) The Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import * as SHA3 from "js-sha3";
// import fetch from "cross-fetch";
import fetch from "node-fetch";
import * as Nacl from "tweetnacl";
import * as assert from "assert";


export const TESTNET_URL = "https://fullnode.devnet.aptoslabs.com";
export const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";

import * as bip39 from '@scure/bip39';
import * as english from '@scure/bip39/wordlists/english'


/** A subset of the fields of a TransactionRequest, for this tutorial */
export type TxnRequest = Record<string, any> & { sequence_number: string };

/** Represents an account as well as the private, public key-pair for the Aptos blockchain */
export class Account {
  signingKey: Nacl.SignKeyPair;

  constructor(seed?: Uint8Array | undefined) {
    if (seed) {
      this.signingKey = Nacl.sign.keyPair.fromSeed(seed);
    } else {
      this.signingKey = Nacl.sign.keyPair();
    }
  }

  /** Returns the address associated with the given account */
  address(): string {
    return this.authKey();
  }

  /** Returns the authKey for the associated account */
  authKey(): string {
    let hash = SHA3.sha3_256.create();
    hash.update(Buffer.from(this.signingKey.publicKey));
    hash.update("\x00");
    return hash.hex();
  }

  /** Returns the public key for the associated account */
  pubKey(): string {
    return Buffer.from(this.signingKey.publicKey).toString("hex");
  }
}

/** A wrapper around the Aptos-core Rest API */
export class RestClient {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  /** Returns the sequence number and authentication key for an account */
  async account(accountAddress: string): Promise<Record<string, string> & { sequence_number: string }> {
    const response = await fetch(`${this.url}/accounts/${accountAddress}`, {method: "GET"});
    if (response.status != 200) {
      assert(response.status == 200, await response.text());
    }
    return await response.json() as any;
  }

  /** Returns all resources associated with the account */
  async accountResources(accountAddress: string): Promise<Record<string, any> & { type: string }> {
    const response = await fetch(`${this.url}/accounts/${accountAddress}/resources`, {method: "GET"});
    if (response.status != 200) {
      assert(response.status == 200, await response.text());
    }
    return await response.json() as any;
  }

  async accountSentEvents(accountAddress: string): Promise<Record<string, any> & { type: string }> {
    const response = await fetch(`${this.url}/accounts/${accountAddress}/events/0x1::TestCoin::TransferEvents/sent_events`, {method: "GET"});
    if (response.status != 200) {
      assert(response.status == 200, await response.text());
    }
    return await response.json()  as any;
  }

  async accountReceivedEvents(accountAddress: string): Promise<Record<string, any> & { type: string }> {
    const response = await fetch(`${this.url}/accounts/${accountAddress}/events/0x1::TestCoin::TransferEvents/received_events`, {method: "GET"});
    if (response.status != 200) {
      assert(response.status == 200, await response.text());
    }
    return await response.json() as any;
  }

  /** Generates a transaction request that can be submitted to produce a raw transaction that
   can be signed, which upon being signed can be submitted to the blockchain. */
  async generateTransaction(sender: string, payload: Record<string, any>): Promise<TxnRequest> {
    const account = await this.account(sender);
    const seqNum = parseInt(account["sequence_number"]);
    return {
      "sender": `0x${sender}`,
      "sequence_number": seqNum.toString(),
      "max_gas_amount": "4000",
      "gas_unit_price": "1",
      "gas_currency_code": "XUS",
      // Unix timestamp, in seconds + 10 minutes
      "expiration_timestamp_secs": (Math.floor(Date.now() / 1000) + 600).toString(),
      "payload": payload,
    };
  }

  /** Converts a transaction request produced by `generate_transaction` into a properly signed
   transaction, which can then be submitted to the blockchain. */
  async signTransaction(accountFrom: Account, txnRequest: TxnRequest): Promise<TxnRequest> {
    const response = await fetch(`${this.url}/transactions/signing_message`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(txnRequest)
    });
    if (response.status != 200) {
      assert(response.status == 200, (await response.text()) + " - " + JSON.stringify(txnRequest));
    }
    const result: Record<string, any> & { message: string } = await response.json() as any;
    const toSign = Buffer.from(result["message"].substring(2), "hex");
    const signature = Nacl.sign(toSign, accountFrom.signingKey.secretKey);
    const signatureHex = Buffer.from(signature).toString("hex").slice(0, 128);
    txnRequest["signature"] = {
      "type": "ed25519_signature",
      "public_key": `0x${accountFrom.pubKey()}`,
      "signature": `0x${signatureHex}`,
    };
    return txnRequest;
  }

  /** Submits a signed transaction to the blockchain. */
  async submitTransaction(accountFrom: Account, txnRequest: TxnRequest): Promise<Record<string, any>> {
    const response = await fetch(`${this.url}/transactions`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(txnRequest)
    });
    if (response.status != 202) {
      assert(response.status == 202, (await response.text()) + " - " + JSON.stringify(txnRequest));
    }
    return await response.json() as any;
  }

  async transactionPending(txnHash: string): Promise<boolean> {
    const response = await fetch(`${this.url}/transactions/${txnHash}`, {method: "GET"});
    if (response.status == 404) {
      return true;
    }
    if (response.status != 200) {
      assert(response.status == 200, await response.text());
    }
    return (await response.json() as any)["type"] == "pending_transaction";
  }

  /** Waits up to 10 seconds for a transaction to move past pending state */
  async waitForTransaction(txnHash: string) {
    let count = 0;
    while (await this.transactionPending(txnHash)) {
      assert(count < 10);
      await new Promise(resolve => setTimeout(resolve, 1000));
      count += 1;
      if (count >= 10) {
        throw new Error(`Waiting for transaction ${txnHash} timed out!`);
      }
    }
  }

  /** Returns the test coin balance associated with the account */
  async accountBalance(accountAddress: string): Promise<number | null> {
    const resources = await this.accountResources(accountAddress);
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
  async transfer(accountFrom: Account, recipient: string, amount: number): Promise<string> {
    const payload: { function: string; arguments: string[]; type: string; type_arguments: any[] } = {
      type: "script_function_payload",
      function: "0x1::TestCoin::transfer",
      type_arguments: [],
      arguments: [
        `0x${recipient}`,
        amount.toString(),
      ]
    };
    const txnRequest = await this.generateTransaction(accountFrom.address(), payload);
    const signedTxn = await this.signTransaction(accountFrom, txnRequest);
    const res = await this.submitTransaction(accountFrom, signedTxn);
    return res["hash"].toString();
  }

}

/** Faucet creates and funds accounts. This is a thin wrapper around that. */
export class FaucetClient {
  url: string;
  restClient: RestClient;

  constructor(url: string, restClient: RestClient) {
    this.url = url;
    this.restClient = restClient;
  }

  /** This creates an account if it does not exist and mints the specified amount of
   coins into that account */
  async fundAccount(authKey: string, amount: number) {
    const url = `${this.url}/mint?amount=${amount}&auth_key=${authKey}`;
    const response = await fetch(url, {method: "POST"});
    if (response.status != 200) {
      assert(response.status == 200, await response.text());
    }
    const tnxHashes = await response.json() as Array<string>;
    for (const tnxHash of tnxHashes) {
      await this.restClient.waitForTransaction(tnxHash);
    }
  }

}

export class TokenClient {
  restClient: RestClient;

  constructor(restClient: RestClient) {
      this.restClient = restClient;
  }

  async submitTransactionHelper(account: Account, payload: Record<string, any>) {
      const txn_request = await this.restClient.generateTransaction(account.address(), payload)
      const signed_txn = await this.restClient.signTransaction(account, txn_request)
      const res = await this.restClient.submitTransaction(account, signed_txn)
      await this.restClient.waitForTransaction(res["hash"])
      return Promise.resolve(res["hash"])
  }

  /** Creates a new collection within the specified account */
  async createCollection(account: Account, description: string, name: string, uri: string) {
      const payload: { function: string; arguments: string[]; type: string; type_arguments: any[] } = {
          type: "script_function_payload",
          function: "0x1::Token::create_unlimited_collection_script",
          type_arguments: [],
          arguments: [
              Buffer.from(description).toString("hex"),
              Buffer.from(name).toString("hex"),
              Buffer.from(uri).toString("hex"),
          ]
      };
      return await this.submitTransactionHelper(account, payload);
  }

  async createToken(
      account: Account,
      collection_name: string,
      description: string,
      name: string,
      supply: number,
      uri: string) {
      const payload: { function: string; arguments: string[]; type: string; type_arguments: any[] } = {
          type: "script_function_payload",
          function: "0x1::Token::create_token_script",
          type_arguments: [],
          arguments: [
              Buffer.from(collection_name).toString("hex"),
              Buffer.from(description).toString("hex"),
              Buffer.from(name).toString("hex"),
              supply.toString(),
              Buffer.from(uri).toString("hex")
          ]
      }
      return await this.submitTransactionHelper(account, payload);
  }

  async offerToken(
      account: Account,
      receiver: string,
      creator: string,
      token_creation_num: number,
      amount: number) {
      const payload: { function: string; arguments: string[]; type: string; type_arguments: any[] } = {
          type: "script_function_payload",
          function: "0x1::TokenTransfers::offer_script",
          type_arguments: [],
          arguments: [
              receiver,
              creator,
              token_creation_num.toString(),
              amount.toString()
          ]
      }
      return await this.submitTransactionHelper(account, payload);
  }

  async claimToken(
      account: Account,
      sender: string,
      creator: string,
      token_creation_num: number) {
      const payload: { function: string; arguments: string[]; type: string; type_arguments: any[] } = {
          type: "script_function_payload",
          function: "0x1::TokenTransfers::claim_script",
          type_arguments: [],
          arguments: [
              sender,
              creator,
              token_creation_num.toString(),
          ]
      }
      return await this.submitTransactionHelper(account, payload);
  }

  async cancelTokenOffer(
      account: Account,
      receiver: string,
      creator: string,
      token_creation_num: number) {
      const payload: { function: string; arguments: string[]; type: string; type_arguments: any[] } = {
          type: "script_function_payload",
          function: "0x1::TokenTransfers::cancel_offer_script",
          type_arguments: [],
          arguments: [
              receiver,
              creator,
              token_creation_num.toString()
          ]
      }
      return await this.submitTransactionHelper(account, payload);
  }

  /** Retrieve the token's creation_num, which is useful for non-creator operations */
  async getTokenId(creator: string, collection_name: string, token_name: string): Promise<number> {
      const resources = await this.restClient.accountResources(creator);
      let collections = []
      let tokens = []
      for (var resource in resources) {
          if (resources[resource]["type"] == "0x1::Token::Collections") {
              collections = resources[resource]["data"]["collections"]["data"];
          }
      } 
      for (var collection in collections) {
          if (collections[collection]["key"] == collection_name) {
              tokens = collections[collection]["value"]["tokens"]["data"];
          }
      }
      for (var token in tokens) {
          if (tokens[token]["key"] == token_name) {
              return parseInt(tokens[token]["value"]["id"]["creation_num"]);
          }
      }
      assert(false);
  }
}


function getAccountFromMnemonic(code: string) {
    if (!bip39.validateMnemonic(code, english.wordlist)) {
        return Promise.reject('Incorrect mnemonic passed');
    }

    var seed = bip39.mnemonicToSeedSync(code.toString());

    const alice = new Account(seed.slice(0,32));
    return Promise.resolve(alice);
}

export async function createWallet() {
    const restClient = new RestClient(TESTNET_URL);
    const faucetClient = new FaucetClient(FAUCET_URL, restClient);

    var code = bip39.generateMnemonic(english.wordlist); // secret recovery phrase

    const alice = await getAccountFromMnemonic(code).catch((msg) => {
        return Promise.reject(msg);
    });

    await faucetClient.fundAccount(alice.authKey(), 10);

    return Promise.resolve({
        "code": code, 
        "address key": alice.address()
    });
}

export async function importWallet(code: string) {
    const restClient = new RestClient(TESTNET_URL);
    const faucetClient = new FaucetClient(FAUCET_URL, restClient);

    const alice = await getAccountFromMnemonic(code).catch((msg) => {
        return Promise.reject(msg);
    });

    await faucetClient.fundAccount(alice.authKey(), 10);

    return Promise.resolve({
        "address key": alice.address()
    });
}

export async function airdrop(code: string, amount: number) {
    const restClient = new RestClient(TESTNET_URL);
    const faucetClient = new FaucetClient(FAUCET_URL, restClient);

    const alice = await getAccountFromMnemonic(code).catch((msg) => {
        return Promise.reject(msg);
    });
    
    await faucetClient.fundAccount(alice.authKey(), amount).then(() => Promise.resolve(true)).catch((msg) => Promise.reject(msg));
}

export async function getBalance(address: string) {
    const restClient = new RestClient(TESTNET_URL);

    var balance = await restClient.accountBalance(address)
    return Promise.resolve(balance);
}

export async function transfer(code: string, recipient_address: string, amount: number) {
    const restClient = new RestClient(TESTNET_URL);

    const alice = await getAccountFromMnemonic(code).catch((msg) => {
        return Promise.reject(msg);
    });

    const txHash = await restClient.transfer(alice, recipient_address, amount);
    await restClient.waitForTransaction(txHash).then(() => Promise.resolve(true)).catch((msg) => Promise.reject(msg));
}

export async function getSentEvents(address: string) {
    const restClient = new RestClient(TESTNET_URL);

    return await restClient.accountSentEvents(address)
}

export async function getReceivedEvents(address: string) {
    const restClient = new RestClient(TESTNET_URL);

    return await restClient.accountReceivedEvents(address)
}

export async function createNFTCollection(code: string, description: string, name: string, uri: string) {
    const restClient = new RestClient(TESTNET_URL);
    const tokenClient = new TokenClient(restClient);

    const alice = await getAccountFromMnemonic(code).catch((msg) => {
        return Promise.reject(msg);
    });

    return await tokenClient.createCollection(alice, description, name, uri);
}

export async function createNFT(code: string, collection_name: string, 
  description: string, name: string, supply: number, uri: string) {

  const restClient = new RestClient(TESTNET_URL);
  const tokenClient = new TokenClient(restClient);

  const alice = await getAccountFromMnemonic(code).catch((msg) => {
      return Promise.reject(msg);
  });

  return await tokenClient.createToken(alice, collection_name, description, name, supply, uri);
}

export async function offerNFT(code: string, receiver_address: string, creator_address: string, 
  collection_name: string, token_name: string, amount: number) {

  const restClient = new RestClient(TESTNET_URL);
  const tokenClient = new TokenClient(restClient);

  const alice = await getAccountFromMnemonic(code).catch((msg) => {
      return Promise.reject(msg);
  });

  const token_id = await tokenClient.getTokenId(creator_address, collection_name, token_name);

  return await tokenClient.offerToken(alice, receiver_address, creator_address, token_id, amount);
}

export async function cancelNFTOffer(code: string, receiver_address: string, creator_address: string, 
  collection_name: string, token_name: string) {

  const restClient = new RestClient(TESTNET_URL);
  const tokenClient = new TokenClient(restClient);

  const alice = await getAccountFromMnemonic(code).catch((msg) => {
      return Promise.reject(msg);
  });

  const token_id = await tokenClient.getTokenId(creator_address, collection_name, token_name);

  return await tokenClient.cancelTokenOffer(alice, receiver_address, creator_address, token_id);
}

export async function claimNFT(code: string, sender_address: string, creator_address: string, 
  collection_name: string, token_name: string) {

  const restClient = new RestClient(TESTNET_URL);
  const tokenClient = new TokenClient(restClient);

  const alice = await getAccountFromMnemonic(code).catch((msg) => {
      return Promise.reject(msg);
  });

  const token_id = await tokenClient.getTokenId(creator_address, collection_name, token_name);

  return await tokenClient.claimToken(alice, sender_address, creator_address, token_id);
}

export async function signGenericTransaction(code: string, func: string, ...args: string[]) {
    const restClient = new RestClient(TESTNET_URL);
    const tokenClient = new TokenClient(restClient);
  
    const alice = await getAccountFromMnemonic(code).catch((msg) => {
        return Promise.reject(msg);
    });

    const payload: { function: string; arguments: string[]; type: string; type_arguments: any[] } = {
      type: "script_function_payload",
      function: func,
      type_arguments: [],
      arguments: args
    }
    return await tokenClient.submitTransactionHelper(alice, payload);
}

export async function getAccountResources(alice_address: string): Promise<Record<string, any> & { type: string }> {
  const restClient = new RestClient(TESTNET_URL);
  return await restClient.accountResources(alice_address);
}

// export async function getGallery(alice_address: string) {
//   const allResources = await getAccountResources(alice_address);
//   for (const key in allResources) {
//     const resource = allResources[key];
//     if (resource["type"] == "0x1::Token::Gallery") {
//       return resource["data"]["gallery"]["value"];
//     }
//   }
// }

// export async function getCollection(alice_address: string) {
//   const allResources = await getAccountResources(alice_address);
//   for (const key in allResources) {
//     const resource = allResources[key];
//     if (resource["type"] == "0x1::Token::Collections") {
//       return resource["data"]["collections"]["value"];
//     }
//   }
// }