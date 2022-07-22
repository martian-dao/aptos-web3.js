import { AptosAccount } from "./aptos_account";
import { TokenClient } from "./token_client";
import { AptosClient } from "./aptos_client";
import { FaucetClient } from "./faucet_client";
import { HexString, MaybeHexString } from "./hex_string";
import { Types } from "./types";
import { Buffer } from "buffer/";
import {
  RawTransaction,
  RawTransactionWithData,
} from "./transaction_builder/aptos_types/transaction";

import * as bip39 from "@scure/bip39";
import * as english from "@scure/bip39/wordlists/english";

const { HDKey } = require("@scure/bip32");
import fetch from "cross-fetch";
import assert from "assert";

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
  publicKey?: string;
}

export interface Wallet {
  code: string; // mnemonic
  accounts: AccountMetaData[];
}

export class WalletClient {
  faucetClient: FaucetClient;
  aptosClient: AptosClient;
  tokenClient: TokenClient;

  constructor(node_url, faucet_url) {
    this.faucetClient = new FaucetClient(node_url, faucet_url);
    this.aptosClient = new AptosClient(node_url);
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
      var publicKey = "";
      var derivationPath = "";
      var authKey = "";
      for (var j = 0; j < ADDRESS_GAP; j++) {
        const exKey = node.derive(`m/44'/${COIN_TYPE}'/${i}'/0/${j}`);
        let acc: AptosAccount = new AptosAccount(exKey.privateKey);
        if (j == 0) {
          address = acc.authKey().toString();
          publicKey = acc.pubKey().toString();
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
        publicKey: publicKey,
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
        continue;
      }
      await this.faucetClient.fundAccount(acc.authKey(), 0);
      return {
        derivationPath: derivationPath,
        address: address,
        publicKey: acc.pubKey().toString(),
      };
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

  async getBalance(address: string | HexString) {
    var balance = 0;
    const resources: any = await this.aptosClient.getAccountResources(address);
    for (const key in resources) {
      const resource = resources[key];
      if (
        resource["type"] == "0x1::coin::CoinStore<0x1::test_coin::TestCoin>"
      ) {
        balance = parseInt(resource["data"]["coin"]["value"]);
      }
    }
    return Promise.resolve(balance);
  }

  async accountTransactions(accountAddress: MaybeHexString) {
    const data = await this.aptosClient.getAccountTransactions(accountAddress);
    const transactions = data.map((item: any) => ({
      data: item.payload,
      from: item.sender,
      gas: item.gas_used,
      gasPrice: item.gas_unit_price,
      hash: item.hash,
      success: item.success,
      timestamp: item.timestamp,
      toAddress: item.payload.arguments[0],
      price: item.payload.arguments[1],
      type: item.type,
      version: item.version,
      vmStatus: item.vm_status,
    }));
    return transactions;
  }

  async transfer(
    account: AptosAccount,
    recipient_address: string | HexString,
    amount: number
  ) {
    try {
      if (recipient_address.toString() === account.address().toString()) {
        return Promise.reject("cannot transfer coins to self");
      }

      const payload: {
        function: string;
        arguments: string[];
        type: string;
        type_arguments: any[];
      } = {
        type: "script_function_payload",
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::test_coin::TestCoin"],

        arguments: [
          `${HexString.ensure(recipient_address)}`,
          amount.toString(),
        ],
      };

      return await this.tokenClient.submitTransactionHelper(account, payload);
    } catch (err) {
      const message = err.response.data.message;
      if (message.includes("caused by error")) {
        return Promise.reject(message.split("caused by error:").pop().trim());
      } else {
        return Promise.reject(message);
      }
    }
  }

  async getSentEvents(address: MaybeHexString) {
    return await this.aptosClient.getAccountTransactions(address);
  }

  async getReceivedEvents(address: string) {
    return await this.aptosClient.getEventsByEventHandle(
      address,
      "0x1::coin::CoinStore<0x1::test_coin::TestCoin>",
      "deposit_events"
    );
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
    uri: string,
    royalty_points_per_million: number = 0
  ) {
    return await this.tokenClient.createToken(
      account,
      collection_name,
      name,
      description,
      supply,
      uri,
      royalty_points_per_million
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
    return await this.tokenClient.cancelTokenOffer(
      account,
      receiver_address,
      creator_address,
      collection_name,
      token_name
    );
  }

  async claimToken(
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
    args: string[],
    type_args: string[]
  ) {
    const payload: {
      function: string;
      arguments: string[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: func,
      type_arguments: type_args,
      arguments: args,
    };

    const txnHash = await this.tokenClient.submitTransactionHelper(
      account,
      payload
    );

    const resp = await this.aptosClient.getTransaction(txnHash);
    const status = { success: resp["success"], vm_status: resp["vm_status"] };

    return { txnHash: txnHash, ...status };
  }

  async signAndSubmitTransaction(
    account: AptosAccount,
    txnRequest: Types.UserTransactionRequest
  ) {
    const signedTxn = await this.aptosClient.signTransaction(
      account,
      txnRequest
    );
    const res = await this.aptosClient.submitTransaction(signedTxn);
    await this.aptosClient.waitForTransaction(res.hash);
    return Promise.resolve(res.hash);
  }

  async signTransaction(
    account: AptosAccount,
    txnRequest: Types.UserTransactionRequest
  ): Promise<Types.SubmitTransactionRequest> {
    return await this.aptosClient.signTransaction(account, txnRequest);
  }

  async submitTransaction(signedTxn: Types.SubmitTransactionRequest) {
    return await this.aptosClient.submitTransaction(signedTxn);
  }

  generateBCSTransaction(
    account: AptosAccount,
    rawTxn: RawTransaction
  ): Promise<Uint8Array> {
    return Promise.resolve(AptosClient.generateBCSTransaction(account, rawTxn));
  }
  generateBCSSimulation(
    account: AptosAccount,
    rawTxn: RawTransaction
  ): Promise<Uint8Array> {
    return Promise.resolve(AptosClient.generateBCSSimulation(account, rawTxn));
  }

  async submitSignedBCSTransaction(
    signedTxn: Uint8Array
  ): Promise<Types.PendingTransaction> {
    return await this.aptosClient.submitSignedBCSTransaction(signedTxn);
  }

  async submitBCSSimulation(
    bcsBody: Uint8Array
  ): Promise<Types.OnChainTransaction> {
    return await this.aptosClient.submitBCSSimulation(bcsBody);
  }

  async signMessage(account: AptosAccount, message: string): Promise<string> {
    return account.signBuffer(Buffer.from(message)).hex();
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
    const transactionStatus = await this.signGenericTransaction(
      account,
      "0x1::account::rotate_authentication_key",
      [newAuthKey],
      []
    );

    if (!transactionStatus.success) {
      return {
        authkey: "",
        success: false,
        vm_status: transactionStatus.vm_status,
      };
    }

    return {
      authkey: "0x" + newAuthKey,
      success: true,
      vm_status: transactionStatus.vm_status,
    };
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
      "0x1::token::TokenStore",
      "deposit_events"
    );
    const withdrawEvents = await this.getEventStream(
      address,
      "0x1::token::TokenStore",
      "withdraw_events"
    );

    var countDeposit = {};
    var countWithdraw = {};
    var tokenIds = [];
    for (var elem of depositEvents) {
      const elem_string = JSON.stringify(elem.data.id)
      countDeposit[elem_string] = countDeposit[
        elem_string
      ]
        ? countDeposit[elem_string] + 1
        : 1;
    }
    for (var elem of withdrawEvents) {
      const elem_string = JSON.stringify(elem.data.id)
      countWithdraw[elem_string] = countWithdraw[
        elem_string
      ]
        ? countWithdraw[elem_string] + 1
        : 1;
    }

    for (var elem of depositEvents) {
      const elem_string = JSON.stringify(elem.data.id)
      const count1 = countDeposit[elem_string];
      const count2 = countWithdraw[elem_string]
        ? countWithdraw[elem_string]
        : 0;
      if (count1 - count2 == 1) {
        tokenIds.push(elem.data.id);
      }
    }
    return tokenIds;
  }

  async getTokens(address: string) {
    let localCache = {};
    const tokenIds = await this.getTokenIds(address);
    var tokens = [];
    for (var tokenId of tokenIds) {
      let resources: Types.AccountResource[];
      if (tokenId.creator in localCache) {
        resources = localCache[tokenId.creator];
      } else {
        resources = await this.aptosClient.getAccountResources(tokenId.creator);
        localCache[tokenId.creator] = resources;
      }
      const accountResource: { type: string; data: any } = resources.find(
        (r) => r.type === "0x1::token::Collections"
      );
      let tableItemRequest: Types.TableItemRequest = {
        key_type: "0x1::token::TokenId",
        value_type: "0x1::token::TokenData",
        key: tokenId,
      };
      const token = (
        await this.aptosClient.getTableItem(
          accountResource.data.token_data.handle,
          tableItemRequest
        )
      ).data;
      tokens.push(token);
    }
    return tokens;
  }

  async getToken(tokenId: TokenId) {
    const resources: Types.AccountResource[] =
      await this.aptosClient.getAccountResources(tokenId.creator);
    const accountResource: { type: string; data: any } = resources.find(
      (r) => r.type === "0x1::token::Collections"
    );

    const tableItemRequest: Types.TableItemRequest = {
      key_type: "0x1::token::TokenId",
      value_type: "0x1::token::TokenData",
      key: tokenId,
    };
    const token = (
      await this.aptosClient.getTableItem(
        accountResource.data.token_data.handle,
        tableItemRequest
      )
    ).data;
    return token;
  }

  // returns the collection data of a user
  async getCollection(address: string, collectionName: string) {
    const resources: Types.AccountResource[] =
      await this.aptosClient.getAccountResources(address);
    const accountResource: { type: string; data: any } = resources.find(
      (r) => r.type === "0x1::token::Collections"
    );

    const tableItemRequest: Types.TableItemRequest = {
      key_type: "0x1::string::String",
      value_type: "0x1::token::Collection",
      key: collectionName,
    };
    const collection = (
      await this.aptosClient.getTableItem(
        accountResource.data.collections.handle,
        tableItemRequest
      )
    ).data;
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

    const tableItemRequest: Types.TableItemRequest = {
      key_type: keyType,
      value_type: valueType,
      key: key,
    };
    const resource = (
      await this.aptosClient.getTableItem(
        accountResource.data[fieldName].handle,
        tableItemRequest
      )
    ).data;
    return resource;
  }

  async getAccountResource(
    accountAddress: string,
    resourceType: string
  ): Promise<any> {
    const response = await fetch(
      `${this.aptosClient.nodeUrl}/accounts/${accountAddress}/resource/${resourceType}`,
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

  /**
   * fungible tokens (coins)
   */

  async initializeCoin(
    account: AptosAccount,
    coin_type_path: string, // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
    name: string,
    symbol: string,
    scaling_factor: number
  ) {
    const payload: {
      function: string;
      arguments: any[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: "0x1::managed_coin::initialize",
      type_arguments: [coin_type_path],
      arguments: [
        Buffer.from(name).toString("hex"),
        Buffer.from(symbol).toString("hex"),
        scaling_factor.toString(),
        false,
      ],
    };
    const txnHash = await this.tokenClient.submitTransactionHelper(
      account,
      payload
    );
    const resp = await this.aptosClient.getTransaction(txnHash);
    const status = { success: resp["success"], vm_status: resp["vm_status"] };

    return { txnHash: txnHash, ...status };
  }

  /** Registers the coin */
  async registerCoin(account: AptosAccount, coin_type_path: string) {
    // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
    const payload: {
      function: string;
      arguments: any[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: "0x1::coin::register",
      type_arguments: [coin_type_path],
      arguments: [],
    };

    const txnHash = await this.tokenClient.submitTransactionHelper(
      account,
      payload
    );
    const resp = await this.aptosClient.getTransaction(txnHash);
    const status = { success: resp["success"], vm_status: resp["vm_status"] };

    return { txnHash: txnHash, ...status };
  }

  /** Mints the coin */
  async mintCoin(
    account: AptosAccount,
    coin_type_path: string, // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
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
      function: "0x1::managed_coin::mint",
      type_arguments: [coin_type_path],
      arguments: [dst_address.toString(), amount.toString()],
    };
    const txnHash = await this.tokenClient.submitTransactionHelper(
      account,
      payload
    );
    const resp = await this.aptosClient.getTransaction(txnHash);
    const status = { success: resp["success"], vm_status: resp["vm_status"] };

    return { txnHash: txnHash, ...status };
  }

  /** Transfers the coins */
  async transferCoin(
    account: AptosAccount,
    coin_type_path: string, // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
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
      function: "0x1::coin::transfer",
      type_arguments: [coin_type_path],
      arguments: [to_address.toString(), amount.toString()],
    };
    const txnHash = await this.tokenClient.submitTransactionHelper(
      account,
      payload
    );
    const resp = await this.aptosClient.getTransaction(txnHash);
    const status = { success: resp["success"], vm_status: resp["vm_status"] };

    return { txnHash: txnHash, ...status };
  }

  async getCoinData(coin_type_path: string) {
    const coin_data = await this.getAccountResource(
      coin_type_path.split("::")[0],
      `0x1::coin::CoinInfo<${coin_type_path}>`
    );
    return coin_data;
  }

  async getCoinBalance(
    address: string,
    coin_type_path: string
  ): Promise<number> {
    // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
    const coin_info = await this.getAccountResource(
      address,
      `0x1::coin::CoinStore<${coin_type_path}>`
    );
    console.log(coin_info);
    return Number(coin_info["data"]["coin"]["value"]);
  }
}
