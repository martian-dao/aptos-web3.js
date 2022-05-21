import { AptosAccount } from "./aptos_account";
import { TokenClient } from "./token_client";
import { AptosClient } from "./aptos_client";
import { FaucetClient } from "./faucet_client";
import { HexString, MaybeHexString } from "./hex_string";
import { Types } from "./types";

import * as bip39 from "@scure/bip39";
import * as english from "@scure/bip39/wordlists/english";

// import BIP32Factory from 'bip32';
// import * as ecc from 'tiny-secp256k1';
// import { BIP32Interface } from 'bip32';

const { HDKey } = require("@scure/bip32");

import fetch from "cross-fetch";
import assert from "assert";

// const bip32 = BIP32Factory(ecc);

const COIN_TYPE = 123420;
const MAX_ACCOUNTS = 5;
const ADDRESS_GAP = 10;

export interface TokenId {
  creator: string;
  collectionName: string;
  name: string;
}

export interface AccountMetaData {
  derivationPath: string;
  address: string;
}

export interface Wallet {
  code: string; // mnemonic
  accounts: AccountMetaData[];
}

/** A wrapper around the Aptos-core Rest API */
export class RestClient {
  client: AptosClient;
  constructor(url: string) {
    this.client = new AptosClient(url);
  }

  async accountSentEvents(accountAddress: string) {
    return await this.client.getEventsByEventHandle(
      accountAddress,
      "0x1::TestCoin::TransferEvents",
      "sent_events"
    );
  }

  async accountReceivedEvents(accountAddress: string) {
    return await this.client.getEventsByEventHandle(
      accountAddress,
      "0x1::TestCoin::TransferEvents",
      "received_events"
    );
  }

  async transactionPending(txnHash: string): Promise<boolean> {
    return this.client.transactionPending(txnHash);
  }

  /** Waits up to 10 seconds for a transaction to move past pending state */
  async waitForTransaction(txnHash: string) {
    return this.client.waitForTransaction(txnHash);
  }

  /** Returns the test coin balance associated with the account */
  async accountBalance(accountAddress: string): Promise<number | null> {
    const resources: any = await this.client.getAccountResources(
      accountAddress
    );
    for (const key in resources) {
      const resource = resources[key];
      if (resource["type"] == "0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>") {
        return parseInt(resource["data"]["coin"]["value"]);
      }
    }
    return null;
  }

  /** Transfer a given coin amount from a given Account to the recipient's account address.
     Returns the sequence number of the transaction used to transfer. */
  async transfer(
    accountFrom: AptosAccount,
    recipient: string,
    amount: number
  ): Promise<string> {
    const payload: {
      function: string;
      arguments: string[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: "0x1::Coin::transfer",
      type_arguments: ["0x1::TestCoin::TestCoin"],

      arguments: [`${HexString.ensure(recipient)}`, amount.toString()],
    };
    const txnRequest = await this.client.generateTransaction(
      accountFrom.address(),
      payload
    );
    const signedTxn = await this.client.signTransaction(
      accountFrom,
      txnRequest
    );
    const res = await this.client.submitTransaction(accountFrom, signedTxn);
    return res["hash"].toString();
  }

  async accountResource(
    accountAddress: string,
    resourceType: string
  ): Promise<any> {
    const response = await fetch(
      `${this.client.nodeUrl}/accounts/${accountAddress}/resource/${resourceType}`,
      { method: "GET" }
    );
    if (response.status == 404) {
      return null;
    }
    if (response.status != 200) {
      assert(response.status == 200, await response.text());
    }
    return await response.json();
  }
}

export class WalletClient {
  faucetClient: FaucetClient;
  restClient: RestClient;
  aptosClient: AptosClient;
  tokenClient: TokenClient;

  constructor(node_url, faucet_url) {
    this.faucetClient = new FaucetClient(node_url, faucet_url);
    this.aptosClient = new AptosClient(node_url);
    this.restClient = new RestClient(node_url);
    this.tokenClient = new TokenClient(this.aptosClient);
  }

  // Get all the accounts of a user from their mnemonic
  async importWallet(code: string): Promise<Wallet> {
    if (!bip39.validateMnemonic(code, english.wordlist)) {
      return Promise.reject("Incorrect mnemonic passed");
    }
    var seed: Uint8Array = bip39.mnemonicToSeedSync(code.toString());
    const node = HDKey.fromMasterSeed(Buffer.from(seed));
    var accountMetaData: AccountMetaData[] = [];
    for (var i = 0; i < MAX_ACCOUNTS; i++) {
      var flag = false;
      var address = "";
      var derivationPath = "";
      var authKey = "";
      for (var j = 0; j < ADDRESS_GAP; j++) {
        const exKey = node.derive(`m/44'/${COIN_TYPE}'/${i}'/0/${j}`);
        let acc: AptosAccount = new AptosAccount(exKey.privateKey);
        if (j == 0) {
          address = acc.authKey().toString();
          const response = await fetch(
            `${this.aptosClient.nodeUrl}/accounts/${address}`,
            {
              method: "GET",
            }
          );
          if (response.status == 404) {
            break;
          }
          const respBody = await response.json();
          authKey = respBody.authentication_key;
        }
        acc = new AptosAccount(exKey.privateKey, address);
        if (acc.authKey().toString() === authKey) {
          flag = true;
          derivationPath = `m/44'/${COIN_TYPE}'/${i}'/0/${j}`;
          break;
        }
      }
      if (!flag) {
        break;
      }
      accountMetaData.push({
        derivationPath: derivationPath,
        address: address,
      });
    }
    return { code: code, accounts: accountMetaData };
  }

  async createWallet(): Promise<Wallet> {
    var code = bip39.generateMnemonic(english.wordlist); // mnemonic
    var accountMetadata = await this.createNewAccount(code);
    return { code: code, accounts: [accountMetadata] };
  }

  async createNewAccount(code: string): Promise<AccountMetaData> {
    var seed: Uint8Array = bip39.mnemonicToSeedSync(code.toString());
    const node = HDKey.fromMasterSeed(Buffer.from(seed));
    for (var i = 0; i < MAX_ACCOUNTS; i++) {
      const derivationPath = `m/44'/${COIN_TYPE}'/${i}'/0/0`;
      const exKey = node.derive(derivationPath);
      let acc: AptosAccount = new AptosAccount(exKey.privateKey);
      const address = acc.authKey().toString();
      const response = await fetch(
        `${this.aptosClient.nodeUrl}/accounts/${address}`,
        {
          method: "GET",
        }
      );
      if (response.status != 404) {
        const respBody = await response.json();
        console.log(i);
        console.log(respBody.authentication_key);
        continue;
      }
      console.log(i);
      await this.faucetClient.fundAccount(acc.authKey(), 0);
      return { derivationPath: derivationPath, address: address };
    }
    throw new Error("Max no. of accounts reached");
  }

  async getAccountFromPrivateKey(privateKey: Buffer, address?: string) {
    return new AptosAccount(privateKey, address);
  }

  // gives the account at position m/44'/COIN_TYPE'/0'/0/0
  async getAccountFromMnemonic(code: string) {
    var seed: Uint8Array = bip39.mnemonicToSeedSync(code.toString());
    const node = HDKey.fromMasterSeed(Buffer.from(seed));
    const exKey = node.derive(`m/44'/${COIN_TYPE}'/0'/0/0`);
    return new AptosAccount(exKey.privateKey);
  }

  async getAccountFromMetaData(code: string, metaData: AccountMetaData) {
    var seed: Uint8Array = bip39.mnemonicToSeedSync(code.toString());
    const node = HDKey.fromMasterSeed(Buffer.from(seed));
    const exKey = node.derive(metaData.derivationPath);
    return new AptosAccount(exKey.privateKey, metaData.address);
  }

  async airdrop(address: string, amount: number) {
    return await this.faucetClient.fundAccount(address, amount);
  }

  async getBalance(address: string) {
    var balance = await this.restClient.accountBalance(address);
    return Promise.resolve(balance);
  }

  async transfer(
    account: AptosAccount,
    recipient_address: string,
    amount: number
  ) {
    const txHash = await this.restClient.transfer(
      account,
      recipient_address,
      amount
    );
    await this.restClient
      .waitForTransaction(txHash)
      .then(() => Promise.resolve(true))
      .catch((msg) => Promise.reject(msg));
  }

  async getSentEvents(address: string) {
    return await this.restClient.accountSentEvents(address);
  }

  async getReceivedEvents(address: string) {
    return await this.restClient.accountReceivedEvents(address);
  }

  async createCollection(
    account: AptosAccount,
    name: string,
    description: string,
    uri: string
  ) {
    return await this.tokenClient.createCollection(
      account,
      name,
      description,
      uri
    );
  }

  async createToken(
    account: AptosAccount,
    collection_name: string,
    name: string,
    description: string,
    supply: number,
    uri: string
  ) {
    return await this.tokenClient.createToken(
      account,
      collection_name,
      name,
      description,
      supply,
      uri
    );
  }

  async offerToken(
    account: AptosAccount,
    receiver_address: string,
    creator_address: string,
    collection_name: string,
    token_name: string,
    amount: number
  ) {
    return await this.tokenClient.offerToken(
      account,
      receiver_address,
      creator_address,
      collection_name,
      token_name,
      amount
    );
  }

  async cancelTokenOffer(
    account: AptosAccount,
    receiver_address: string,
    creator_address: string,
    collection_name: string,
    token_name: string
  ) {
    const token_id = await this.tokenClient.getTokenId(
      creator_address,
      collection_name,
      token_name
    );
    return await this.tokenClient.cancelTokenOffer(
      account,
      receiver_address,
      creator_address,
      token_id
    );
  }

  async claimNFT(
    account: AptosAccount,
    sender_address: string,
    creator_address: string,
    collection_name: string,
    token_name: string
  ) {
    return await this.tokenClient.claimToken(
      account,
      sender_address,
      creator_address,
      collection_name,
      token_name
    );
  }

  async signGenericTransaction(
    account: AptosAccount,
    func: string,
    ...args: string[]
  ) {
    const payload: {
      function: string;
      arguments: string[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: func,
      type_arguments: [],
      arguments: args,
    };
    return await this.tokenClient.submitTransactionHelper(account, payload);
  }

  async rotateAuthKey(code: string, metaData: AccountMetaData) {
    const account: AptosAccount = await this.getAccountFromMetaData(
      code,
      metaData
    );
    const pathSplit = metaData.derivationPath.split("/");
    const address_index = parseInt(pathSplit[pathSplit.length - 1]);
    if (address_index >= ADDRESS_GAP - 1) {
      throw new Error("Maximum key rotation reached");
    }
    const newDerivationPath = `${pathSplit
      .slice(0, pathSplit.length - 1)
      .join("/")}/${address_index + 1}`;
    const newAccount = await this.getAccountFromMetaData(code, {
      address: metaData.address,
      derivationPath: newDerivationPath,
    });
    var newAuthKey = newAccount.authKey().toString().split("0x")[1];
    console.log(newAuthKey);
    return await this.signGenericTransaction(
      account,
      "0x1::Account::rotate_authentication_key",
      newAuthKey
    );
  }

  async getEventStream(
    address: string,
    eventHandleStruct: string,
    fieldName: string
  ) {
    const response = await fetch(
      `${this.aptosClient.nodeUrl}/accounts/${address}/events/${eventHandleStruct}/${fieldName}`,
      {
        method: "GET",
      }
    );

    if (response.status == 404) {
      return [];
    }

    return await response.json();
  }

  // returns a list of token IDs of the tokens in a user's account (including the tokens that were minted)
  async getTokenIds(address: string) {
    const depositEvents = await this.getEventStream(
      address,
      "0x1::Token::TokenStore",
      "deposit_events"
    );
    const withdrawEvents = await this.getEventStream(
      address,
      "0x1::Token::TokenStore",
      "withdraw_events"
    );
    function isEventEqual(event1, event2) {
      return (
        event1.data.id.creator === event2.data.id.creator &&
        event1.data.id.collectionName === event2.data.id.collectionName &&
        event1.data.id.name === event2.data.id.name
      );
    }
    var tokenIds = [];
    for (var elem of depositEvents) {
      if (
        !withdrawEvents.some(function (item) {
          return isEventEqual(item, elem);
        })
      ) {
        tokenIds.push(elem.data.id);
      }
    }
    return tokenIds;
  }

  async getTokens(address: string) {
    const tokenIds = await this.getTokenIds(address);
    var tokens = [];
    for (var tokenId of tokenIds) {
      const resources: Types.AccountResource[] =
        await this.aptosClient.getAccountResources(tokenId.creator);
      const accountResource: { type: string; data: any } = resources.find(
        (r) => r.type === "0x1::Token::Collections"
      );
      let token = await this.tokenClient.tableItem(
        accountResource.data.token_data.handle,
        "0x1::Token::TokenId",
        "0x1::Token::TokenData",
        tokenId
      );
      tokens.push(token);
    }
    return tokens;
  }

  async getToken(tokenId: TokenId) {
    const resources: Types.AccountResource[] =
      await this.aptosClient.getAccountResources(tokenId.creator);
    const accountResource: { type: string; data: any } = resources.find(
      (r) => r.type === "0x1::Token::Collections"
    );
    let token = await this.tokenClient.tableItem(
      accountResource.data.token_data.handle,
      "0x1::Token::TokenId",
      "0x1::Token::TokenData",
      tokenId
    );
    return token;
  }

  // returns the collection data of a user
  async getCollection(address: string, collectionName: string) {
    const resources: Types.AccountResource[] =
      await this.aptosClient.getAccountResources(address);
    const accountResource: { type: string; data: any } = resources.find(
      (r) => r.type === "0x1::Token::Collections"
    );
    let collection = await this.tokenClient.tableItem(
      accountResource.data.collections.handle,
      "0x1::ASCII::String",
      "0x1::Token::Collection",
      collectionName
    );
    return collection;
  }

  async getCustomResource(
    address: string,
    resourceType: string,
    fieldName: string,
    keyType: string,
    valueType: string,
    key: any
  ) {
    const resources: Types.AccountResource[] =
      await this.aptosClient.getAccountResources(address);
    const accountResource: { type: string; data: any } = resources.find(
      (r) => r.type === resourceType
    );
    let resource = await this.tokenClient.tableItem(
      accountResource.data[fieldName].handle,
      keyType,
      valueType,
      key
    );
    return resource;
  }

  ///////////// fungible tokens (coins)

  async initiateCoin(
    account: AptosAccount,
    type_parameter: string,
    name: string,
    scaling_factor: number
  ) {
    const payload: {
      function: string;
      arguments: any[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: "0x1::Coin::initialize",
      type_arguments: [type_parameter],
      arguments: [
        Buffer.from(name).toString("hex"),
        scaling_factor.toString(),
        false,
      ],
    };
    await this.tokenClient.submitTransactionHelper(account, payload);
  }

  /** Registers the coin */
  async registerCoin(account: AptosAccount, type_parameter: string) {
    const payload: {
      function: string;
      arguments: any[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: "0x1::Coin::register",
      type_arguments: [type_parameter],
      arguments: [],
    };
    await this.tokenClient.submitTransactionHelper(account, payload);
  }

  /** Mints the coin */
  async mintCoin(
    account: AptosAccount,
    type_parameter: string,
    dst_address: string,
    amount: number
  ) {
    const payload: {
      function: string;
      arguments: any[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: "0x1::Coin::mint",
      type_arguments: [type_parameter],
      arguments: [dst_address.toString(), amount.toString()],
    };
    await this.tokenClient.submitTransactionHelper(account, payload);
  }

  /** Transfers the coins */
  async transferCoin(
    account: AptosAccount,
    type_parameter: string,
    to_address: string,
    amount: number
  ) {
    const payload: {
      function: string;
      arguments: any[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: "0x1::Coin::transfer",
      type_arguments: [type_parameter],
      arguments: [to_address.toString(), amount.toString()],
    };
    await this.tokenClient.submitTransactionHelper(account, payload);
  }

  async getCoinBalance(address: string, coin_address: string): Promise<number> {
    const coin_info = await this.restClient.accountResource(
      address,
      `0x1::Coin::CoinStore<${coin_address}>`
    );
    return coin_info["data"]["coin"]["value"];
  }
}
