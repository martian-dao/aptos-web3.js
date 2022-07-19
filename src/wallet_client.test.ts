import {WalletClient} from "./wallet_client"
import { NODE_URL, FAUCET_URL } from "./util.test";

const apis = new WalletClient(NODE_URL, FAUCET_URL)

test("new test", async () => {
    const aliceAccount = await apis.getAccountFromMnemonic("fresh left easily alpha round wood someone unfair draft fly vital observe");
    const bobAccount = await apis.getAccountFromMnemonic("entry seed float trial team foster cram next master please aisle rotate");

    await apis.airdrop(aliceAccount.address().toString(), 20000);
    await apis.airdrop(bobAccount.address().toString(), 20000);

    const collection_name = "collName735";
    const token_name = "NFT #1";

    // Create collection and token on Alice's account
    // await apis.createCollection(aliceAccount, collection_name, "Alice's simple collection", "https://aptos.dev");

    // await apis.createToken(
    //     aliceAccount,
    //     collection_name,
    //     token_name,
    //     "Alice's simple token",
    //     1,
    //     "https://aptos.dev/img/nyan.jpeg",
    // );

    await apis.offerToken(aliceAccount, bobAccount.address().toString(), aliceAccount.address().toString(), collection_name, token_name, 1);
    // await apis.claimToken(bobAccount, aliceAccount.address().toString(), aliceAccount.address().toString(), collection_name, token_name);

    var tokens = await apis.getTokens(aliceAccount.address().toString());
    console.log(tokens);
})

// test("verify airdrop", async () => {
//     const alice = await apis.createWallet();
//     var aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[0]);
//     await apis.airdrop(aliceAccount.address().toString(), 1234);
//     expect(await apis.getBalance(aliceAccount.address())).toBe(1234);
// })

// test("verify transfer", async () => {
//     const alice = await apis.createWallet();
//     var aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[0]);

//     await apis.airdrop(aliceAccount.address().toString(), 20000);
//     const bob = await apis.createWallet();
    
//     var bobAccount = await apis.getAccountFromMetaData(bob.code, bob.accounts[0]);
//     await apis.transfer(aliceAccount, bobAccount.address(), 15000);
//     expect(await apis.getBalance(bobAccount.address())).toBe(15000);
// });

// test("verify creating collection and NFT", async () => {
//     const alice = await apis.createWallet();
//     var aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[0]);

//     await apis.airdrop(aliceAccount.address().toString(), 20000);

//     const collection_name = "AliceCollection";
//     const token_name = "Alice Token";

//     // Create collection and token on Alice's account
//     await apis.createCollection(aliceAccount, collection_name, "Alice's simple collection", "https://aptos.dev");

//     await apis.createToken(
//         aliceAccount,
//         collection_name,
//         token_name,
//         "Alice's simple token",
//         1,
//         "https://aptos.dev/img/nyan.jpeg",
//     );

//     const tokens = await apis.getTokens(aliceAccount.address().toString());
//     expect(tokens[0].name).toBe(token_name);
// }) 

// test("verify transferring NFT", async () => {
//     const alice = await apis.createWallet();
//     var aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[0]);

//     const bob = await apis.createWallet();
//     var bobAccount = await apis.getAccountFromMetaData(bob.code, bob.accounts[0]);

//     await apis.airdrop(aliceAccount.address().toString(), 20000);
//     await apis.airdrop(bobAccount.address().toString(), 20000);

//     const collection_name = "AliceCollection";
//     const token_name = "Alice Token";

//     // Create collection and token on Alice's account
//     await apis.createCollection(aliceAccount, collection_name, "Alice's simple collection", "https://aptos.dev");

//     await apis.createToken(
//         aliceAccount,
//         collection_name,
//         token_name,
//         "Alice's simple token",
//         1,
//         "https://aptos.dev/img/nyan.jpeg",
//     );

//     await apis.offerToken(aliceAccount, bobAccount.address().toString(), aliceAccount.address().toString(), collection_name, token_name, 1);
//     await apis.claimToken(bobAccount, aliceAccount.address().toString(), aliceAccount.address().toString(), collection_name, token_name);

//     var tokens = await apis.getTokens(aliceAccount.address().toString());
//     expect(tokens.length).toBe(0);
//     tokens = await apis.getTokens(bobAccount.address().toString());
//     expect(tokens[0].name).toBe(token_name);
// }) 

// test("verify signGenericTransaction", async () => {
//     const alice = await apis.createWallet();
//     var aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[0]);

//     await apis.airdrop(aliceAccount.address().toString(), 20000);
//     const bob = await apis.createWallet();
    
//     var bobAccount = await apis.getAccountFromMetaData(bob.code, bob.accounts[0]);
//     await apis.signGenericTransaction(aliceAccount, "0x1::Coin::transfer", [bobAccount.address().toString(), "15000"], ["0x1::TestCoin::TestCoin"]);
//     expect(await apis.getBalance(bobAccount.address())).toBe(15000);
// })

// test("verify fungible tokens", async () => {
//     // a test account which contains the deployed MartianCoin module
//     const secretkey = new Buffer([
//         208,  41, 122,   9, 121,  25, 194, 111, 188, 201,  90,
//         201, 215, 170,  16, 221, 226,  27,  98,  54, 212, 202,
//         158, 150,  47, 171,  45,  71, 142,  78,  46, 168, 137,
//          28,  33, 223, 101,  15, 214, 216, 223,  86,  34, 187,
//         198, 214, 192,  17,  49, 212, 225,  55, 185, 166, 223,
//         237,  61, 141, 229,  19,  66,  15, 192, 218
//     ]);

//     const alice = await apis.getAccountFromPrivateKey(secretkey);

//     await apis.airdrop(alice.address().toString(), 20000);

//     const bob = await apis.createWallet();
//     var bobAccount = await apis.getAccountFromMetaData(bob.code, bob.accounts[0]);
//     await apis.airdrop(bobAccount.address().toString(), 20000);

//     const coin_type_path = `${alice.address().toString()}::MartianCoin::MartianCoin`; // the address will change with time

//     await apis.initializeCoin(alice, coin_type_path, "Martian Coin", "MAR", 6);
//     await apis.registerCoin(alice, coin_type_path);
//     await apis.mintCoin(alice, coin_type_path, alice.address().toString(), 3000);
//     await apis.getCoinBalance(alice.address().toString(), coin_type_path);

//     await apis.registerCoin(bobAccount, coin_type_path);
//     await apis.transferCoin(alice, coin_type_path, bobAccount.address().toString(), 1000);
    
//     expect(await apis.getCoinBalance(bobAccount.address().toString(), coin_type_path)).toBe(1000);
// })


// test("should be able to create a new wallet and rotate auth keys", async () => {
//     // var alice = await apis.createWallet();
//     // console.log(alice);

//     // var aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[0]);

//     // await apis.rotateAuthKey(alice.code, alice.accounts[0]);
//     const tmp = "fresh left easily alpha round wood someone unfair draft fly vital observe"
//     const alice = await apis.importWallet(tmp);
//     await apis.airdrop(alice[0].address().toString(), 20000);
//     // await apis.createNewAccount(alice.code);
//     // alice = await apis.importWallet(alice.code);

//     // await apis.createNewAccount(alice.code);
//     // alice = await apis.importWallet(alice.code);

//     // await apis.createNewAccount(alice.code);
//     // alice = await apis.importWallet(alice.code);

//     // aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[2]);
//     // await apis.airdrop(aliceAccount.address().toString(), 20000);

//     // console.log(await apis.rotateAuthKey(alice.code, alice.accounts[2]));
//     // alice = await apis.importWallet(alice.code);

//     // aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[2]);
//     // await apis.rotateAuthKey(alice.code, alice.accounts[2]);
//     // alice = await apis.importWallet(alice.code);

//     // aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[2]);
//     // await apis.transfer(aliceAccount, alice.accounts[3].address, 100);
//     // console.log(await apis.getBalance(aliceAccount.address().toString()));

//     // console.log(await apis.getBalance(alice.accounts[3].address));
// },300000);
