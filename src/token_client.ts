import { AptosAccount } from "./aptos_account";
import { AptosClient } from "./aptos_client";
import { Types } from "./types";
import { MaybeHexString } from "./hex_string";

import assert from "assert";
import fetch from "cross-fetch";

export interface HashWithStatus {
  txnHash: string,
  success: string | boolean
}


export class TokenClient {
  aptosClient: AptosClient;

  constructor(aptosClient: AptosClient) {
    this.aptosClient = aptosClient;
  }

  async submitTransactionHelper(account: AptosAccount, payload: Types.TransactionPayload) {
    const txnRequest = await this.aptosClient.generateTransaction(account.address(), payload, {
      max_gas_amount: "4000",
    });
    const signedTxn = await this.aptosClient.signTransaction(account, txnRequest);
    const res = await this.aptosClient.submitTransaction(account, signedTxn);
    await this.aptosClient.waitForTransaction(res.hash);
    return Promise.resolve(res.hash);
  }

  async getTransactionStatus(txnHash: string) {
    const resp = await this.aptosClient.getTransaction(txnHash)
    // console.log(resp)
    return {success: resp['success'], vm_status: resp['vm_status']}
  }

  // Creates a new collection within the specified account
  async createCollection(
    account: AptosAccount,
    name: string,
    description: string,
    uri: string,
  ): Promise<HashWithStatus> {
    const payload: Types.TransactionPayload = {
      type: "script_function_payload",
      function: "0x1::Token::create_unlimited_collection_script",
      type_arguments: [],
      arguments: [
        Buffer.from(name).toString("hex"),
        Buffer.from(description).toString("hex"),
        Buffer.from(uri).toString("hex"),
      ],
    };
    const transactionHash = await this.submitTransactionHelper(account, payload);
    const status = await this.getTransactionStatus(transactionHash)
    return {txnHash: transactionHash, ...status};
  }

  // Creates a new token within the specified account
  async createToken(
    account: AptosAccount,
    collectionName: string,
    name: string,
    description: string,
    supply: number,
    uri: string,
  ): Promise<HashWithStatus> {
    const payload: Types.TransactionPayload = {
      type: "script_function_payload",
      function: "0x1::Token::create_limited_token_script",
      type_arguments: [],
      arguments: [
        Buffer.from(collectionName).toString("hex"),
        Buffer.from(name).toString("hex"),
        Buffer.from(description).toString("hex"),
        true,
        supply.toString(),
        supply.toString()+1,
        Buffer.from(uri).toString("hex"),
        "0"
      ],
    };
    const transactionHash = await this.submitTransactionHelper(account, payload);
    const status = await this.getTransactionStatus(transactionHash)
    return {txnHash: transactionHash, ...status};
  }

  // Offer token to another account
  async offerToken(
    account: AptosAccount,
    receiver: MaybeHexString,
    creator: MaybeHexString,
    collectionName: string,
    name: string,
    amount: number,
  ): Promise<HashWithStatus> {
    const payload: Types.TransactionPayload = {
      type: "script_function_payload",
      function: "0x1::TokenTransfers::offer_script",
      type_arguments: [],
      arguments: [
        receiver,
        creator,
        Buffer.from(collectionName).toString("hex"),
        Buffer.from(name).toString("hex"),
        amount.toString(),
      ],
    };
    const transactionHash = await this.submitTransactionHelper(account, payload);
    const status = await this.getTransactionStatus(transactionHash)
    return {txnHash: transactionHash, ...status};
  }

  // Claim token
  async claimToken(
    account: AptosAccount,
    sender: MaybeHexString,
    creator: MaybeHexString,
    collectionName: string,
    name: string,
  ): Promise<HashWithStatus> {
    const payload: Types.TransactionPayload = {
      type: "script_function_payload",
      function: "0x1::TokenTransfers::claim_script",
      type_arguments: [],
      arguments: [
        sender,
        creator,
        Buffer.from(collectionName).toString("hex"),
        Buffer.from(name).toString("hex"),
      ],
    };
    const transactionHash = await this.submitTransactionHelper(account, payload);
    const status = await this.getTransactionStatus(transactionHash)
    return {txnHash: transactionHash, ...status};
  }

  // Cancel token
  async cancelTokenOffer(
    account: AptosAccount,
    receiver: MaybeHexString,
    creator: MaybeHexString,
    tokenCreationNum: number,
  ): Promise<Types.HexEncodedBytes> {
    const payload: Types.TransactionPayload = {
      type: "script_function_payload",
      function: "0x1::TokenTransfers::cancel_offer_script",
      type_arguments: [],
      arguments: [receiver, creator, tokenCreationNum.toString()],
    };
    const transactionHash = await this.submitTransactionHelper(account, payload);
    console.log("Cancel Token Status")
    this.getTransactionStatus(transactionHash)
    return transactionHash;
  }

  async tableItem(handle: string, keyType: string, valueType: string, key: any): Promise<any> {
    const response = await fetch(`${this.aptosClient.nodeUrl}/tables/${handle}/item`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "key_type": keyType,
            "value_type": valueType,
            "key": key
        })
    });

    if (response.status == 404) {
        return null
    } else if (response.status != 200) {
        assert(response.status == 200, await response.text());
    } else {
        return await response.json();
    }
  }

  /** Retrieve the token's creation_num, which is useful for non-creator operations */
  async getTokenId(creator: string, collection_name: string, token_name: string): Promise<number> {
    const resources: Types.AccountResource[] = await this.aptosClient.getAccountResources(creator);
    const accountResource: { type: string; data: any } = resources.find((r) => r.type === "0x1::Token::Collections");
    let collection = await this.tableItem(
      accountResource.data.collections.handle,
      "0x1::ASCII::String",
      "0x1::Token::Collection",
      collection_name,
    );
    let tokenData = await this.tableItem(
      collection["tokens"]["handle"],
      "0x1::ASCII::String",
      "0x1::Token::TokenData",
      token_name,
    );
    return tokenData["id"]["creation_num"]
  }
}
