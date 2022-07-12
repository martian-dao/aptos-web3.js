import { AptosAccount } from "./aptos_account";
import { TokenClient } from "./token_client";
import { AptosClient } from "./aptos_client";
import { FaucetClient } from "./faucet_client";
import { HexString, MaybeHexString } from "./hex_string";
import { Types } from "./types";

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

  async getBalance(address: string | HexString) {
    var balance = 0;
    const resources: any = await this.aptosClient.getAccountResources(
      address
    );
    for (const key in resources) {
      const resource = resources[key];
      if (resource["type"] == "0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>") {
        balance = parseInt(resource["data"]["coin"]["value"]);
      }
    }
    return Promise.resolve(balance);
  }

  async accountTransactions(accountAddress: MaybeHexString) {
    const data = await this.aptosClient.getAccountTransactions(
      accountAddress
    );
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
        Promise.reject("cannot transfer coins to self");
      }

      const balance = await this.getBalance(account.address());

      // balance should be greater than amount + static gas amount
      if (balance < amount + 150) {
        Promise.reject("insufficient balance (including gas fees)");
      }

      const payload: {
        function: string;
        arguments: string[];
        type: string;
        type_arguments: any[];
      } = {
        type: "script_function_payload",
        function: "0x1::Coin::transfer",
        type_arguments: ["0x1::TestCoin::TestCoin"],
  
        arguments: [`${HexString.ensure(recipient_address)}`, amount.toString()],
      };

      await this.tokenClient.submitTransactionHelper(account, payload);

    } catch (err) {
      const message = err.response.data.message;
      if (message.includes("caused by error")) {
        Promise.reject(message.split("caused by error:").pop().trim());
      } else {
        Promise.reject(message);
      }
    }
  }

  async getSentEvents(address: MaybeHexString) {
    return await this.aptosClient.getAccountTransactions(address);
  }

  async getReceivedEvents(address: string) {
    return await this.aptosClient.getEventsByEventHandle(
      address,
      "0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>",
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
    royalty_points_per_million: number = 0,
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
      "0x1::Account::rotate_authentication_key",
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

      const tableItemRequest: Types.TableItemRequest = {
        key_type: "0x1::Token::TokenId",
        value_type: "0x1::Token::TokenData",
        key: tokenId,
      };
      const token = (await this.aptosClient.getTableItem(accountResource.data.token_data.handle, tableItemRequest)).data;

      const collectionData = await this.getCollection(
        tokenId.creator,
        token.collection
      );
      token.collectionData = collectionData;
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

    const tableItemRequest: Types.TableItemRequest = {
      key_type: "0x1::Token::TokenId",
      value_type: "0x1::Token::TokenData",
      key: tokenId,
    };
    const token = (await this.aptosClient.getTableItem(accountResource.data.token_data.handle, tableItemRequest)).data;
    return token;
  }

  // returns the collection data of a user
  async getCollection(address: string, collectionName: string) {
    const resources: Types.AccountResource[] =
      await this.aptosClient.getAccountResources(address);
    const accountResource: { type: string; data: any } = resources.find(
      (r) => r.type === "0x1::Token::Collections"
    );

    const tableItemRequest: Types.TableItemRequest = {
      key_type: "0x1::ASCII::String",
      value_type: "0x1::Token::Collection",
      key: collectionName,
    };
    const collection = (await this.aptosClient.getTableItem(accountResource.data.collections.handle, tableItemRequest)).data;
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
    const resource = (await this.aptosClient.getTableItem(accountResource.data[fieldName].handle, tableItemRequest)).data;
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
    coin_type_path: string, // coin_type_path: something like 0x${coinTypeAddress}::MoonCoin::MoonCoin
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
        function: "0x1::ManagedCoin::initialize",
        type_arguments: [coin_type_path],
        arguments: [
          Buffer.from(name).toString("hex"),
          Buffer.from(symbol).toString("hex"),
          scaling_factor.toString(),
          false,
        ],
      };
      return await this.tokenClient.submitTransactionHelper(account, payload)
  }

  /** Registers the coin */
  async registerCoin(account: AptosAccount, coin_type_path: string) { // coin_type_path: something like 0x${coinTypeAddress}::MoonCoin::MoonCoin
    const payload: {
      function: string;
      arguments: any[];
      type: string;
      type_arguments: any[];
    } = {
      type: "script_function_payload",
      function: "0x1::Coin::register",
      type_arguments: [coin_type_path],
      arguments: [],
    };
    return await this.tokenClient.submitTransactionHelper(account, payload);
  }

  /** Mints the coin */
  async mintCoin(
    account: AptosAccount,
    coin_type_path: string, // coin_type_path: something like 0x${coinTypeAddress}::MoonCoin::MoonCoin
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
      function: "0x1::ManagedCoin::mint",
      type_arguments: [coin_type_path],
      arguments: [dst_address.toString(), amount.toString()],
    };
    return await this.tokenClient.submitTransactionHelper(account, payload);
  }

  /** Transfers the coins */
  async transferCoin(
    account: AptosAccount,
    coin_type_path: string, // coin_type_path: something like 0x${coinTypeAddress}::MoonCoin::MoonCoin
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
      type_arguments: [coin_type_path],
      arguments: [to_address.toString(), amount.toString()],
    };
    return await this.tokenClient.submitTransactionHelper(account, payload);
  }

  async getCoinData(coin_type_path: string) {
    const coin_data = await this.getAccountResource(
      coin_type_path.split("::")[0],
      `0x1::Coin::CoinInfo<${coin_type_path}>`
    );
    console.log(coin_data);
    return coin_data;
  }

  async getCoinBalance(address: string, coin_type_path: string): Promise<number> { // coin_type_path: something like 0x${coinTypeAddress}::MoonCoin::MoonCoin
    const coin_info = await this.getAccountResource(
      address,
      `0x1::Coin::CoinStore<${coin_type_path}>`
    );
    return Number(coin_info["data"]["coin"]["value"]);
  }
}
