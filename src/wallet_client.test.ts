import * as Nacl from "tweetnacl";
import * as bip39 from "@scure/bip39";
import * as english from "@scure/bip39/wordlists/english";
import { Ed25519, Ed25519KeygenResult } from "@sodot/sodot-node-sdk";
import { WalletClient } from "./wallet_client";
import { AptosAccount, BCS, TxnBuilderTypes } from ".";
import { HexString } from "./utils";
import {
  NODE_URL,
  FAUCET_URL,
  MAINNET_NODE_URL,
} from "./utils/test_helper.test";

const { Ed25519PublicKey, AuthenticationKey } = TxnBuilderTypes;
const apis = new WalletClient(NODE_URL, FAUCET_URL);

function hexToUint8Array(hexString: string) {
  const strippedHexString = hexString.replace(/^0x/, "");
  const byteLength = strippedHexString.length / 2;

  return new Uint8Array(
    Array.from({ length: byteLength }, (_, i) =>
      parseInt(strippedHexString.substr(i * 2, 2), 16),
    ),
  );
}

/**
 *
 * @param metadata: string which is signed by private key
 * @param signature: signature of signed string/metadata
 * @param publicKey: public key of the private key using which metadata is signed
 * @returns boolean: true if signature is valid else false
 */
function verifySignature(message, signature, publicKey) {
  const signatureBuffer = Buffer.from(signature.slice(2), "hex");
  let pubKey = publicKey.slice(2);
  if (pubKey.length < 64) {
    pubKey = "0".repeat(64 - pubKey.length) + pubKey;
  }
  const publicKeyBuffer = Buffer.from(pubKey, "hex");
  return Nacl.sign.detached.verify(
    new TextEncoder().encode(message),
    signatureBuffer,
    publicKeyBuffer,
  );
}

test("verify create wallet", async () => {
  const alice = await apis.createWallet();
  const aliceAccount = await WalletClient.getAccountFromMetaData(
    alice.code,
    alice.accounts[0],
  );
  await apis.airdrop(aliceAccount.address().toString(), 0);
  const getAccount = await apis.aptosClient.getAccount(aliceAccount.address());
  expect(HexString.ensure(getAccount.authentication_key).toString()).toBe(
    aliceAccount.address().toString(),
  );
});

test("verify getAccountFromMnemonic", async () => {
  const alice = await apis.createWallet();
  const aliceAccount1 = await WalletClient.getAccountFromMetaData(
    alice.code,
    alice.accounts[0],
  );
  const aliceAccount2 = await WalletClient.getAccountFromMnemonic(alice.code);
  expect(aliceAccount1.address().toString()).toEqual(
    aliceAccount2.address().toString(),
  );
});

test("verify import wallet", async () => {
  const alice = await apis.createWallet();
  const importedAlice = await apis.importWallet(alice.code);
  expect(importedAlice.accounts[0].address).toBe(alice.accounts[0].address);
});

test("verify import random wallet", async () => {
  const code = bip39.generateMnemonic(english.wordlist); // mnemonic
  const alice = await apis.importWallet(code);
  const aliceAccount = await WalletClient.getAccountFromMetaData(
    alice.code,
    alice.accounts[0],
  );
  await apis.airdrop(aliceAccount.address().toString(), 0);
  const getAccount = await apis.aptosClient.getAccount(aliceAccount.address());
  expect(HexString.ensure(getAccount.authentication_key).toString()).toBe(
    aliceAccount.address().toString(),
  );
});

test("verify airdrop", async () => {
  const alice = await apis.createWallet();
  const aliceAccount = await WalletClient.getAccountFromMetaData(
    alice.code,
    alice.accounts[0],
  );
  await apis.airdrop(aliceAccount.address().toString(), 1234);
  expect(await apis.getBalance(aliceAccount.address())).toBe(1234);
});

test(
  "verify transfer",
  async () => {
    const alice = await apis.createWallet();
    const aliceAccount = await WalletClient.getAccountFromMetaData(
      alice.code,
      alice.accounts[0],
    );

    await apis.airdrop(aliceAccount.address().toString(), 10000000);
    const bob = await apis.createWallet();

    const bobAccount = await WalletClient.getAccountFromMetaData(
      bob.code,
      bob.accounts[0],
    );
    await apis.transfer(aliceAccount, bobAccount.address(), 100000);
    expect(await apis.getBalance(bobAccount.address())).toBe(100000);
  },
  60 * 1000,
);

test("verify signMessage", async () => {
  const alice = await apis.createWallet();
  const aliceAccount = await WalletClient.getAccountFromMetaData(
    alice.code,
    alice.accounts[0],
  );
  const message = "This is a test message";
  const signature = await WalletClient.signMessage(aliceAccount, message);
  expect(
    verifySignature(message, signature, aliceAccount.pubKey().toString()),
  ).toBe(true);
});

test(
  "verify get token resource handle",
  async () => {
    const alice = await apis.createWallet();
    const aliceAccount = await WalletClient.getAccountFromMetaData(
      alice.code,
      alice.accounts[0],
    );

    await apis.airdrop(aliceAccount.address().toString(), 10000000);

    const collectionName = "AliceCollection";
    const tokenName = "Alice Token";

    // Create collection and token on Alice's account
    await apis.createCollection(
      aliceAccount,
      collectionName,
      "Alice's simple collection",
      "https://aptos.dev",
    );

    await apis.createToken(
      aliceAccount,
      collectionName,
      tokenName,
      "Alice's simple token",
      1,
      "https://aptos.dev/img/nyan.jpeg",
    );

    const tokens = (await apis.getTokenIds(aliceAccount.address().toString()))
      .tokenIds;
    const token = tokens[0].data;

    const resourceHandle = await apis.getTokenResourceHandle(token);
    const tokenData = await apis.getToken(token, resourceHandle);
    expect(tokenData.name).toBe(tokenName);
  },
  60 * 1000,
);

test(
  "verify creating collection and NFT",
  async () => {
    const alice = await apis.createWallet();
    const aliceAccount = await WalletClient.getAccountFromMetaData(
      alice.code,
      alice.accounts[0],
    );

    await apis.airdrop(aliceAccount.address().toString(), 10000000);
    const collectionName = "AliceCollection";
    const tokenName = "Alice Token";

    // Create collection and token on Alice's account
    await apis.createCollection(
      aliceAccount,
      collectionName,
      "Alice's simple collection",
      "https://aptos.dev",
    );

    await apis.createToken(
      aliceAccount,
      collectionName,
      tokenName,
      "Alice's simple token",
      1,
      "https://aptos.dev/img/nyan.jpeg",
    );

    const tokens = await apis.getTokens(aliceAccount.address().toString());
    expect(tokens[0].token.name).toBe(tokenName);
  },
  60 * 1000,
);

test(
  "verify transferring NFT",
  async () => {
    const alice = await apis.createWallet();
    const aliceAccount = await WalletClient.getAccountFromMetaData(
      alice.code,
      alice.accounts[0],
    );

    const bob = await apis.createWallet();
    const bobAccount = await WalletClient.getAccountFromMetaData(
      bob.code,
      bob.accounts[0],
    );

    await apis.airdrop(aliceAccount.address().toString(), 10000000);
    await apis.airdrop(bobAccount.address().toString(), 10000000);

    const collectionName = "AliceCollection";
    const tokenName = "Alice Token";

    // Create collection and token on Alice's account
    await apis.createCollection(
      aliceAccount,
      collectionName,
      "Alice's simple collection",
      "https://aptos.dev",
    );

    await apis.createToken(
      aliceAccount,
      collectionName,
      tokenName,
      "Alice's simple token",
      1,
      "https://aptos.dev/img/nyan.jpeg",
    );

    await apis.offerToken(
      aliceAccount,
      bobAccount.address().toString(),
      aliceAccount.address().toString(),
      collectionName,
      tokenName,
      1,
      0,
    );
    await apis.claimToken(
      bobAccount,
      aliceAccount.address().toString(),
      aliceAccount.address().toString(),
      collectionName,
      tokenName,
      0,
    );

    const aliceTokens = (
      await apis.getTokenIds(aliceAccount.address().toString())
    ).tokenIds;

    expect(aliceTokens.length).toBe(1);
    expect(aliceTokens[0].difference).toBe(0);

    const bobTokens = (await apis.getTokenIds(bobAccount.address().toString()))
      .tokenIds;
    expect(bobTokens.length).toBe(1);
    expect(bobTokens[0].difference).toBe(1);
  },
  60 * 1000,
);

test(
  "verify signAndSubmitTransactions",
  async () => {
    const alice = await apis.createWallet();
    const aliceAccount = await WalletClient.getAccountFromMetaData(
      alice.code,
      alice.accounts[0],
    );
    await apis.airdrop(aliceAccount.address().toString(), 10000000);

    const collectionName = "AptosCollection";
    const tokenName = "AptosToken";

    const txn1 = {
      sender: aliceAccount.address().toString(),
      payload: {
        function: "0x3::token::create_collection_script",
        type_arguments: [],
        arguments: [
          collectionName,
          "description",
          "https://www.aptos.dev",
          12345,
          [false, false, false],
        ],
      },
    };

    const txn2 = {
      sender: aliceAccount.address().toString(),
      payload: {
        function: "0x3::token::create_token_script",
        type_arguments: [],
        arguments: [
          collectionName,
          tokenName,
          "token description",
          1,
          12345,
          "https://aptos.dev/img/nyan.jpeg",
          aliceAccount.address().toString(),
          0,
          0,
          [false, false, false, false, false],
          [],
          [],
          [],
        ],
      },
    };

    await apis.signAndSubmitTransactions(aliceAccount, [txn1, txn2]);

    const tokens = await apis.getTokens(aliceAccount.address().toString());
    expect(tokens[0].token.name).toBe(tokenName);
  },
  60 * 1000,
);

// test(
//   "verify estimate gas fees",
//   async () => {
//     const alice = await apis.createWallet();
//     const aliceAccount = await WalletClient.getAccountFromMetaData(
//       alice.code,
//       alice.accounts[0]
//     );
//     const bob = await apis.createWallet();
//     const bobAccount = await WalletClient.getAccountFromMetaData(
//       bob.code,
//       bob.accounts[0]
//     );
//     await apis.airdrop(aliceAccount.address().toString(), 100_000_0);
//     const txn = await apis.aptosClient.generateTransaction(
//       aliceAccount.address().toString(),
//       {
//         function: "0x1::coin::transfer",
//         type_arguments: ["0x1::aptos_coin::AptosCoin"],
//         arguments: [bobAccount.address().toString(), 500],
//       }
//     );
//     const estimatedGas = await apis.estimateGasFees(aliceAccount, txn);
//     const txnHash = await apis.signAndSubmitTransaction(aliceAccount, txn);
//     const txnData: any = await apis.aptosClient.getTransactionByHash(txnHash);
//     expect(estimatedGas).toBe(txnData.gas_used);
//   },
//   60 * 1000
// );

// test(
//   "verify estimate cost",
//   async () => {
//     const alice = await apis.createWallet();
//     const aliceAccount = await WalletClient.getAccountFromMetaData(
//       alice.code,
//       alice.accounts[0]
//     );
//     await apis.airdrop(aliceAccount.address().toString(), 10000000);
//     const collectionName = "AptosCollection";
//     const tokenName = "AptosToken";

//     const txn1 = await apis.aptosClient.generateTransaction(
//       aliceAccount.address().toString(),
//       {
//         function: "0x3::token::create_collection_script",
//         type_arguments: [],
//         arguments: [
//           collectionName,
//           "description",
//           "https://www.aptos.dev",
//           "1234",
//           [false, false, false],
//         ],
//       }
//     );

//     await apis.signAndSubmitTransaction(aliceAccount, txn1);

//     const txn2 = await apis.aptosClient.generateTransaction(
//       aliceAccount.address().toString(),
//       {
//         function: "0x3::token::create_token_script",
//         type_arguments: [],
//         arguments: [
//           collectionName,
//           tokenName,
//           "token description",
//           "1",
//           "1234",
//           "https://aptos.dev/img/nyan.jpeg",
//           aliceAccount.address().toString(),
//           "0",
//           "0",
//           [false, false, false, false, false],
//           [],
//           [],
//           [],
//         ],
//       }
//     );
//     const estimatedCost = await apis.estimateCost(aliceAccount, txn2);
//     const currentBalance = await apis.getBalance(aliceAccount.address());
//     const txnHash = await apis.signAndSubmitTransaction(aliceAccount, txn2);
//     const txnData: any = await apis.aptosClient.getTransactionByHash(txnHash);
//     const updatedBalance = await apis.getBalance(aliceAccount.address());
//     expect(estimatedCost).toBe(
//       (currentBalance - updatedBalance - txnData.gas_used).toString()
//     );
//   },
//   60 * 1000
// );

test("verify get transaction serialized", async () => {
  const alice = await apis.createWallet();
  const aliceAccount = await WalletClient.getAccountFromMetaData(
    alice.code,
    alice.accounts[0],
  );
  await apis.airdrop(aliceAccount.address().toString(), 0);
  const sender = aliceAccount.address();
  const payload = {
    function: "0x1::aptos_account::transfer",
    type_arguments: [],
    arguments: [aliceAccount.address().toString(), 500],
  };

  const originalTxn = await apis.aptosClient.generateTransaction(
    sender,
    payload,
  );
  const serializer = new BCS.Serializer();
  originalTxn.serialize(serializer);
  const deserialized = WalletClient.getTransactionDeserialized(
    serializer.getBytes(),
  );
  expect(deserialized).toStrictEqual(originalTxn);
});

// // test("verify fungible tokens", async () => {
// //     const alice = await apis.createWallet();
// //     var aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[0]);
// //     await apis.airdrop(aliceAccount.address().toString(), 10000000);

// //     const bob = await apis.createWallet();
// //     var bobAccount = await apis.getAccountFromMetaData(bob.code, bob.accounts[0]);
// //     await apis.airdrop(bobAccount.address().toString(), 10000000);
// //     // the address will change with time
// //     const coin_type_path = `${aliceAccount.address().toString()}::MartianCoin::MartianCoin`;

// //     await apis.initializeCoin(aliceAccount, coin_type_path, "Martian Coin", "MAR", 6);
// //     await apis.registerCoin(aliceAccount, coin_type_path);
// //     await apis.mintCoin(aliceAccount, coin_type_path, aliceAccount.address().toString(), 3000);
// //     await apis.getCoinBalance(aliceAccount.address().toString(), coin_type_path);

// //     await apis.registerCoin(bobAccount, coin_type_path);
// //     await apis.transferCoin(aliceAccount, coin_type_path, bobAccount.address().toString(), 1000);

// //     expect(await apis.getCoinBalance(bobAccount.address().toString(), coin_type_path)).toBe(1000);
// // })

test("should be able to create multiple accounts in a wallet", async () => {
  let alice = await apis.createWallet();
  let aliceAccount = await WalletClient.getAccountFromMetaData(
    alice.code,
    alice.accounts[0],
  );

  const a1 = await apis.createNewAccount(alice.code, 0);
  await apis.airdrop(a1.address, 0);
  alice = await apis.importWallet(alice.code);

  const a2 = await apis.createNewAccount(alice.code, 1);
  await apis.airdrop(a2.address, 0);
  alice = await apis.importWallet(alice.code);

  const a3 = await apis.createNewAccount(alice.code, 2);
  await apis.airdrop(a3.address, 0);
  alice = await apis.importWallet(alice.code);

  aliceAccount = await WalletClient.getAccountFromMetaData(
    alice.code,
    alice.accounts[1],
  );
  await apis.airdrop(aliceAccount.address().toString(), 10000000);

  await apis.transfer(aliceAccount, alice.accounts[2].address, 100);

  expect(await apis.getBalance(alice.accounts[2].address)).toBe(100);
}, 300000);

test("verify direct transfer status", async () => {
  const mainnetClient = new WalletClient(MAINNET_NODE_URL, FAUCET_URL);

  let address =
    "0x7570a9606fbfe1dc82eb0a2688c2328a382f36756a5cffc3eee71247d401044c";
  expect(await mainnetClient.getTokenDirectTransferStatus(address)).toBe(true);

  address =
    "0xda61174c40ee80d6a3b1fc649a2451db22b1b6d9cb11c963cd43c116909bb2c1";
  expect(await mainnetClient.getTokenDirectTransferStatus(address)).toBe(false);
});

/**
 * Test to sign and submit for mpc account
 */

test("verify sign and submit using mpc account", async () => {
  // first do keygen
  const keygenRoom = await Ed25519.createKeygenRoom(2);
  const keygenInitResult1 = await Ed25519.initKeygen();
  const keygenInitResult2 = await Ed25519.initKeygen();
  const [keygenResult1, keygenResult2] = await Promise.all([
    Ed25519.keygen(keygenRoom, 2, 2, keygenInitResult1, [
      keygenInitResult2.keygenId,
    ]),
    Ed25519.keygen(keygenRoom, 2, 2, keygenInitResult2, [
      keygenInitResult1.keygenId,
    ]),
  ]);

  // keygenResult1 is the user's keyshare to be used in the sdk
  const secretKeyArr = hexToUint8Array(keygenResult1.secretShare);
  const pubKey = new Ed25519PublicKey(keygenResult1.pubkey);
  const authKey = AuthenticationKey.fromEd25519PublicKey(pubKey);
  const address = authKey.derivedAddress();

  const account = new AptosAccount(
    secretKeyArr,
    address.hex(),
    true,
    keygenResult1.pubkey,
    "abc@gmail.com",
  );
  const bob = await apis.createWallet();

  const bobAccount = await WalletClient.getAccountFromMetaData(
    bob.code,
    bob.accounts[0],
  );
  // airdrop to both accounts so as to initialize the tokens
  await apis.airdrop(address.toString(), 10000000);
  await apis.airdrop(bobAccount.address().toString(), 1);

  // generate the RawTransaction
  const txnRequest = await apis.aptosClient.generateTransaction(
    address.toString(),
    {
      function: "0x1::coin::transfer",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [bobAccount.address().toString(), 500],
    },
  );

  // get signingmessage
  const signingMessageImmediate =
    await WalletClient.getSigningMessage(txnRequest);
  const keygenResult = new Ed25519KeygenResult(
    account.signingKey.publicKey,
    HexString.fromUint8Array(account.signingKey.secretKey)
      .toString()
      .substring(2),
  );

  // signing and formatting
  const signingRoom = await Ed25519.createSigningRoom(2);
  const [signature] = await Promise.all([
    Ed25519.sign(signingRoom, keygenResult, signingMessageImmediate),
    Ed25519.sign(signingRoom, keygenResult2, signingMessageImmediate),
  ]);
  const authenticator = new TxnBuilderTypes.TransactionAuthenticatorEd25519(
    new TxnBuilderTypes.Ed25519PublicKey(keygenResult.pubkey),
    new TxnBuilderTypes.Ed25519Signature(signature),
  );
  const signedTxn = new TxnBuilderTypes.SignedTransaction(
    txnRequest,
    authenticator,
  );
  const bcsTxn = BCS.bcsToBytes(signedTxn);
  // submitting the signed transaction
  const transactionRes = await apis.submitSignedBCSTransaction(bcsTxn);
  await apis.aptosClient.waitForTransactionWithResult(transactionRes.hash);
  const balanceAfterTransfer = await apis.getBalance(
    bobAccount.address().toString(),
  );
  expect(balanceAfterTransfer).toBe(501);
});
