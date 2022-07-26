[@martiandao/aptos-web3-bip44.js](../README.md) / [Exports](../modules.md) / WalletClient

# Class: WalletClient

## Table of contents

### Constructors

- [constructor](WalletClient.md#constructor)

### Properties

- [aptosClient](WalletClient.md#aptosclient)
- [faucetClient](WalletClient.md#faucetclient)
- [tokenClient](WalletClient.md#tokenclient)

### Methods

- [accountTransactions](WalletClient.md#accounttransactions)
- [airdrop](WalletClient.md#airdrop)
- [cancelTokenOffer](WalletClient.md#canceltokenoffer)
- [claimToken](WalletClient.md#claimtoken)
- [createCollection](WalletClient.md#createcollection)
- [createNewAccount](WalletClient.md#createnewaccount)
- [createToken](WalletClient.md#createtoken)
- [createWallet](WalletClient.md#createwallet)
- [getAccountResource](WalletClient.md#getaccountresource)
- [getBalance](WalletClient.md#getbalance)
- [getCoinBalance](WalletClient.md#getcoinbalance)
- [getCoinData](WalletClient.md#getcoindata)
- [getCollection](WalletClient.md#getcollection)
- [getCustomResource](WalletClient.md#getcustomresource)
- [getEventStream](WalletClient.md#geteventstream)
- [getReceivedEvents](WalletClient.md#getreceivedevents)
- [getSentEvents](WalletClient.md#getsentevents)
- [getToken](WalletClient.md#gettoken)
- [getTokenIds](WalletClient.md#gettokenids)
- [getTokens](WalletClient.md#gettokens)
- [importWallet](WalletClient.md#importwallet)
- [initializeCoin](WalletClient.md#initializecoin)
- [mintCoin](WalletClient.md#mintcoin)
- [offerToken](WalletClient.md#offertoken)
- [registerCoin](WalletClient.md#registercoin)
- [rotateAuthKey](WalletClient.md#rotateauthkey)
- [signAndSubmitTransaction](WalletClient.md#signandsubmittransaction)
- [signAndSubmitTransactions](WalletClient.md#signandsubmittransactions)
- [signGenericTransaction](WalletClient.md#signgenerictransaction)
- [signTransaction](WalletClient.md#signtransaction)
- [submitBCSSimulation](WalletClient.md#submitbcssimulation)
- [submitSignedBCSTransaction](WalletClient.md#submitsignedbcstransaction)
- [submitTransaction](WalletClient.md#submittransaction)
- [transfer](WalletClient.md#transfer)
- [transferCoin](WalletClient.md#transfercoin)
- [generateBCSSimulation](WalletClient.md#generatebcssimulation)
- [generateBCSTransaction](WalletClient.md#generatebcstransaction)
- [getAccountFromMetaData](WalletClient.md#getaccountfrommetadata)
- [getAccountFromMnemonic](WalletClient.md#getaccountfrommnemonic)
- [getAccountFromPrivateKey](WalletClient.md#getaccountfromprivatekey)
- [signMessage](WalletClient.md#signmessage)

## Constructors

### constructor

• **new WalletClient**(`node_url`, `faucet_url`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node_url` | `any` |
| `faucet_url` | `any` |

#### Defined in

wallet_client.ts:44

## Properties

### aptosClient

• **aptosClient**: `AptosClient`

#### Defined in

wallet_client.ts:40

___

### faucetClient

• **faucetClient**: `FaucetClient`

#### Defined in

wallet_client.ts:38

___

### tokenClient

• **tokenClient**: `TokenClient`

#### Defined in

wallet_client.ts:42

## Methods

### accountTransactions

▸ **accountTransactions**(`accountAddress`): `Promise`<{ `data`: `any` = item.payload; `from`: `any` = item.sender; `gas`: `any` = item.gas\_used; `gasPrice`: `any` = item.gas\_unit\_price; `hash`: `any` = item.hash; `price`: `any` ; `success`: `any` = item.success; `timestamp`: `any` = item.timestamp; `toAddress`: `any` ; `type`: `any` = item.type; `version`: `any` = item.version; `vmStatus`: `any` = item.vm\_status }[]\>

returns the list of on-chain transactions sent by the said account

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `accountAddress` | `MaybeHexString` | address of the desired account |

#### Returns

`Promise`<{ `data`: `any` = item.payload; `from`: `any` = item.sender; `gas`: `any` = item.gas\_used; `gasPrice`: `any` = item.gas\_unit\_price; `hash`: `any` = item.hash; `price`: `any` ; `success`: `any` = item.success; `timestamp`: `any` = item.timestamp; `toAddress`: `any` ; `type`: `any` = item.type; `version`: `any` = item.version; `vmStatus`: `any` = item.vm\_status }[]\>

list of transactions

#### Defined in

wallet_client.ts:240

___

### airdrop

▸ **airdrop**(`address`, `amount`): `Promise`<`string`[]\>

airdrops test coins in the given account

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | address of the receiver's account |
| `amount` | `number` | amount to be airdropped |

#### Returns

`Promise`<`string`[]\>

list of transaction hashs

#### Defined in

wallet_client.ts:211

___

### cancelTokenOffer

▸ **cancelTokenOffer**(`account`, `receiver_address`, `creator_address`, `collection_name`, `token_name`): `Promise`<`string`\>

cancels an NFT offer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `AptosAccount` | AptosAccount of the signing account |
| `receiver_address` | `string` | address of the receiver account |
| `creator_address` | `string` | address of the creator account |
| `collection_name` | `string` | collection name |
| `token_name` | `string` | NFT name |

#### Returns

`Promise`<`string`\>

transaction hash

#### Defined in

wallet_client.ts:424

___

### claimToken

▸ **claimToken**(`account`, `sender_address`, `creator_address`, `collection_name`, `token_name`): `Promise`<`string`\>

claims offered NFT

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `AptosAccount` | AptosAccount of the signing account |
| `sender_address` | `string` | address of the sender account |
| `creator_address` | `string` | address of the creator account |
| `collection_name` | `string` | collection name |
| `token_name` | `string` | NFT name |

#### Returns

`Promise`<`string`\>

transaction hash

#### Defined in

wallet_client.ts:452

___

### createCollection

▸ **createCollection**(`account`, `name`, `description`, `uri`): `Promise`<`string`\>

creates an NFT collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `AptosAccount` | AptosAccount object of the signing account |
| `name` | `string` | collection name |
| `description` | `string` | collection description |
| `uri` | `string` | collection URI |

#### Returns

`Promise`<`string`\>

transaction hash

#### Defined in

wallet_client.ts:338

___

### createNewAccount

▸ **createNewAccount**(`code`): `Promise`<[`AccountMetaData`](../interfaces/AccountMetaData.md)\>

Creates a new account in the provided wallet

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | mnemonic phrase of the wallet |

#### Returns

`Promise`<[`AccountMetaData`](../interfaces/AccountMetaData.md)\>

#### Defined in

wallet_client.ts:136

___

### createToken

▸ **createToken**(`account`, `collection_name`, `name`, `description`, `supply`, `uri`, `royalty_points_per_million?`): `Promise`<`string`\>

creates an NFT

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `account` | `AptosAccount` | `undefined` | AptosAccount object of the signing account |
| `collection_name` | `string` | `undefined` | collection name |
| `name` | `string` | `undefined` | NFT name |
| `description` | `string` | `undefined` | NFT description |
| `supply` | `number` | `undefined` | supply for the NFT |
| `uri` | `string` | `undefined` | NFT URI |
| `royalty_points_per_million` | `number` | `0` | royalty points per million |

#### Returns

`Promise`<`string`\>

transaction hash

#### Defined in

wallet_client.ts:361

___

### createWallet

▸ **createWallet**(): `Promise`<[`Wallet`](../interfaces/Wallet.md)\>

Creates a new wallet which contains a single account,
which is registered on Aptos

#### Returns

`Promise`<[`Wallet`](../interfaces/Wallet.md)\>

A wallet object

#### Defined in

wallet_client.ts:124

___

### getAccountResource

▸ **getAccountResource**(`accountAddress`, `resourceType`): `Promise`<`any`\>

returns info about a particular resource inside an account

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `accountAddress` | `string` | address of the desired account |
| `resourceType` | `string` | type of the desired resource |

#### Returns

`Promise`<`any`\>

resource information

#### Defined in

wallet_client.ts:842

___

### getBalance

▸ **getBalance**(`address`): `Promise`<`number`\>

returns the balance of the said account

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` \| `HexString` | address of the desired account |

#### Returns

`Promise`<`number`\>

balance of the account

#### Defined in

wallet_client.ts:223

___

### getCoinBalance

▸ **getCoinBalance**(`address`, `coin_type_path`): `Promise`<`number`\>

returns the balance of the coin for an account

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | address of the desired account |
| `coin_type_path` | `string` | address path of the desired coin |

#### Returns

`Promise`<`number`\>

number of coins

#### Defined in

wallet_client.ts:1035

___

### getCoinData

▸ **getCoinData**(`coin_type_path`): `Promise`<`any`\>

returns the information about the coin

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `coin_type_path` | `string` | address path of the desired coin |

#### Returns

`Promise`<`any`\>

coin information

#### Defined in

wallet_client.ts:1020

___

### getCollection

▸ **getCollection**(`address`, `collectionName`): `Promise`<`any`\>

returns the information about a collection of an account

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | address of the desired account |
| `collectionName` | `string` | collection name |

#### Returns

`Promise`<`any`\>

collection information

#### Defined in

wallet_client.ts:786

___

### getCustomResource

▸ **getCustomResource**(`address`, `resourceType`, `fieldName`, `keyType`, `valueType`, `key`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `resourceType` | `string` |
| `fieldName` | `string` |
| `keyType` | `string` |
| `valueType` | `string` |
| `key` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

wallet_client.ts:807

___

### getEventStream

▸ **getEventStream**(`address`, `eventHandleStruct`, `fieldName`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `eventHandleStruct` | `string` |
| `fieldName` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

wallet_client.ts:641

___

### getReceivedEvents

▸ **getReceivedEvents**(`address`): `Promise`<`Event`[]\>

returns the list of events involving transactions of Aptos Coins
received by the said account

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | address of the desired account |

#### Returns

`Promise`<`Event`[]\>

list of events

#### Defined in

wallet_client.ts:319

___

### getSentEvents

▸ **getSentEvents**(`address`): `Promise`<`OnChainTransaction`[]\>

returns the list of events involving transactions
starting from the said account

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `MaybeHexString` | address of the desired account |

#### Returns

`Promise`<`OnChainTransaction`[]\>

list of events

#### Defined in

wallet_client.ts:306

___

### getToken

▸ **getToken**(`tokenId`): `Promise`<`any`\>

returns the token information (including the collection information)
about a said tokenID

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tokenId` | [`TokenId`](../interfaces/TokenId.md) | token ID of the desired token |

#### Returns

`Promise`<`any`\>

token information

#### Defined in

wallet_client.ts:758

___

### getTokenIds

▸ **getTokenIds**(`address`): `Promise`<`any`[]\>

returns a list of token IDs of the tokens in a user's account 
(including the tokens that were minted)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | address of the desired account |

#### Returns

`Promise`<`any`[]\>

list of token IDs

#### Defined in

wallet_client.ts:667

___

### getTokens

▸ **getTokens**(`address`): `Promise`<`any`[]\>

returns the tokens in an account

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | address of the desired account |

#### Returns

`Promise`<`any`[]\>

list of tokens and their collection data

#### Defined in

wallet_client.ts:717

___

### importWallet

▸ **importWallet**(`code`): `Promise`<[`Wallet`](../interfaces/Wallet.md)\>

Each mnemonic phrase corresponds to a single wallet
Wallet can contain multiple accounts
An account corresponds to a key pair + address

Get all the accounts of a user from their mnemonic phrase

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | The mnemonic phrase (12 word) |

#### Returns

`Promise`<[`Wallet`](../interfaces/Wallet.md)\>

Wallet object containing all accounts of a user

#### Defined in

wallet_client.ts:60

___

### initializeCoin

▸ **initializeCoin**(`account`, `coin_type_path`, `name`, `symbol`, `scaling_factor`): `Promise`<{ `success`: `any` = resp.success; `txnHash`: `string` ; `vm_status`: `any` = resp.vm\_status }\>

initializes a coin

precondition: a module of the desired coin has to be deployed in the signer's account

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `AptosAccount` | AptosAccount object of the signing account |
| `coin_type_path` | `string` | address path of the desired coin |
| `name` | `string` | name of the coin |
| `symbol` | `string` | symbol of the coin |
| `scaling_factor` | `number` | scaling factor of the coin |

#### Returns

`Promise`<{ `success`: `any` = resp.success; `txnHash`: `string` ; `vm_status`: `any` = resp.vm\_status }\>

transaction hash

#### Defined in

wallet_client.ts:871

___

### mintCoin

▸ **mintCoin**(`account`, `coin_type_path`, `dst_address`, `amount`): `Promise`<{ `success`: `any` = resp.success; `txnHash`: `string` ; `vm_status`: `any` = resp.vm\_status }\>

mints a coin in a receiver account

precondition: the signer should have minting capability
unless specifically granted, only the account where the module
of the desired coin lies has the minting capability

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `AptosAccount` | AptosAccount object of the signing account |
| `coin_type_path` | `string` | address path of the desired coin |
| `dst_address` | `string` | address of the receiver account |
| `amount` | `number` | amount to be minted |

#### Returns

`Promise`<{ `success`: `any` = resp.success; `txnHash`: `string` ; `vm_status`: `any` = resp.vm\_status }\>

transaction hash

#### Defined in

wallet_client.ts:951

___

### offerToken

▸ **offerToken**(`account`, `receiver_address`, `creator_address`, `collection_name`, `token_name`, `amount`): `Promise`<`string`\>

offers an NFT to another account

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `AptosAccount` | AptosAccount object of the signing account |
| `receiver_address` | `string` | address of the receiver account |
| `creator_address` | `string` | address of the creator account |
| `collection_name` | `string` | collection name |
| `token_name` | `string` | NFT name |
| `amount` | `number` | amount to receive while offering the token |

#### Returns

`Promise`<`string`\>

transaction hash

#### Defined in

wallet_client.ts:394

___

### registerCoin

▸ **registerCoin**(`account`, `coin_type_path`): `Promise`<{ `success`: `any` = resp.success; `txnHash`: `string` ; `vm_status`: `any` = resp.vm\_status }\>

registers a coin for an account

creates the resource for the desired account such that
the account can start transacting in the desired coin

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `AptosAccount` | AptosAccount object of the signing account |
| `coin_type_path` | `string` | address path of the desired coin |

#### Returns

`Promise`<{ `success`: `any` = resp.success; `txnHash`: `string` ; `vm_status`: `any` = resp.vm\_status }\>

transaction hash

#### Defined in

wallet_client.ts:914

___

### rotateAuthKey

▸ **rotateAuthKey**(`code`, `metaData`): `Promise`<{ `authkey`: `string` = ""; `success`: `boolean` = false; `vm_status`: `any` = transactionStatus.vm\_status }\>

Rotates the auth key

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | mnemonic phrase for the desired wallet |
| `metaData` | [`AccountMetaData`](../interfaces/AccountMetaData.md) | metadata for the desired account |

#### Returns

`Promise`<{ `authkey`: `string` = ""; `success`: `boolean` = false; `vm_status`: `any` = transactionStatus.vm\_status }\>

status object

#### Defined in

wallet_client.ts:601

___

### signAndSubmitTransaction

▸ **signAndSubmitTransaction**(`account`, `txnRequest`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `AptosAccount` |
| `txnRequest` | `UserTransactionRequest` |

#### Returns

`Promise`<`string`\>

#### Defined in

wallet_client.ts:508

___

### signAndSubmitTransactions

▸ **signAndSubmitTransactions**(`account`, `txnRequests`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `AptosAccount` |
| `txnRequests` | `UserTransactionRequest`[] |

#### Returns

`Promise`<`any`[]\>

#### Defined in

wallet_client.ts:522

___

### signGenericTransaction

▸ **signGenericTransaction**(`account`, `func`, `args`, `type_args`): `Promise`<{ `success`: `any` = resp.success; `txnHash`: `string` ; `vm_status`: `any` = resp.vm\_status }\>

sign a generic transaction

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `AptosAccount` | AptosAccount of the signing account |
| `func` | `string` | function name to be called |
| `args` | `string`[] | arguments of the function to be called |
| `type_args` | `string`[] | type arguments of the function to be called |

#### Returns

`Promise`<{ `success`: `any` = resp.success; `txnHash`: `string` ; `vm_status`: `any` = resp.vm\_status }\>

transaction hash

#### Defined in

wallet_client.ts:479

___

### signTransaction

▸ **signTransaction**(`account`, `txnRequest`): `Promise`<`SubmitTransactionRequest`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `AptosAccount` |
| `txnRequest` | `UserTransactionRequest` |

#### Returns

`Promise`<`SubmitTransactionRequest`\>

#### Defined in

wallet_client.ts:549

___

### submitBCSSimulation

▸ **submitBCSSimulation**(`bcsBody`): `Promise`<`OnChainTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `bcsBody` | `Uint8Array` |

#### Returns

`Promise`<`OnChainTransaction`\>

#### Defined in

wallet_client.ts:584

___

### submitSignedBCSTransaction

▸ **submitSignedBCSTransaction**(`signedTxn`): `Promise`<`PendingTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signedTxn` | `Uint8Array` |

#### Returns

`Promise`<`PendingTransaction`\>

#### Defined in

wallet_client.ts:576

___

### submitTransaction

▸ **submitTransaction**(`signedTxn`): `Promise`<`PendingTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signedTxn` | `SubmitTransactionRequest` |

#### Returns

`Promise`<`PendingTransaction`\>

#### Defined in

wallet_client.ts:558

___

### transfer

▸ **transfer**(`account`, `recipient_address`, `amount`): `Promise`<`string` \| `Error`\>

transfers Aptos Coins from signer to receiver

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `AptosAccount` | AptosAccount object of the signing account |
| `recipient_address` | `string` \| `HexString` | address of the receiver account |
| `amount` | `number` | amount of aptos coins to be transferred |

#### Returns

`Promise`<`string` \| `Error`\>

transaction hash

#### Defined in

wallet_client.ts:267

___

### transferCoin

▸ **transferCoin**(`account`, `coin_type_path`, `to_address`, `amount`): `Promise`<{ `success`: `any` = resp.success; `txnHash`: `string` ; `vm_status`: `any` = resp.vm\_status }\>

transfers coin (applicable for all altcoins on Aptos) to receiver account

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `AptosAccount` | AptosAccount object of the signing account |
| `coin_type_path` | `string` | address path of the desired coin |
| `to_address` | `string` | address of the receiver account |
| `amount` | `number` | amount to be transferred |

#### Returns

`Promise`<{ `success`: `any` = resp.success; `txnHash`: `string` ; `vm_status`: `any` = resp.vm\_status }\>

transaction hash

#### Defined in

wallet_client.ts:987

___

### generateBCSSimulation

▸ `Static` **generateBCSSimulation**(`account`, `rawTxn`): `Promise`<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `AptosAccount` |
| `rawTxn` | `RawTransaction` |

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

wallet_client.ts:569

___

### generateBCSTransaction

▸ `Static` **generateBCSTransaction**(`account`, `rawTxn`): `Promise`<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `AptosAccount` |
| `rawTxn` | `RawTransaction` |

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

wallet_client.ts:562

___

### getAccountFromMetaData

▸ `Static` **getAccountFromMetaData**(`code`, `metaData`): `AptosAccount`

returns an AptosAccount object for the desired account
using the metadata of the account

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | mnemonic phrase of the wallet |
| `metaData` | [`AccountMetaData`](../interfaces/AccountMetaData.md) | metadata of the account to be fetched |

#### Returns

`AptosAccount`

#### Defined in

wallet_client.ts:197

___

### getAccountFromMnemonic

▸ `Static` **getAccountFromMnemonic**(`code`): `AptosAccount`

returns an AptosAccount at position m/44'/COIN_TYPE'/0'/0/0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | mnemonic phrase of the wallet |

#### Returns

`AptosAccount`

AptosAccount object

#### Defined in

wallet_client.ts:182

___

### getAccountFromPrivateKey

▸ `Static` **getAccountFromPrivateKey**(`privateKey`, `address?`): `AptosAccount`

returns an AptosAccount object given a private key and
address of the account

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `Buffer` | Private key of an account as a Buffer |
| `address?` | `string` | address of a user |

#### Returns

`AptosAccount`

AptosAccount object

#### Defined in

wallet_client.ts:172

___

### signMessage

▸ `Static` **signMessage**(`account`, `message`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `AptosAccount` |
| `message` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

wallet_client.ts:590
