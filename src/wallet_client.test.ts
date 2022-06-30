import {WalletClient} from "./wallet_client"
import { NODE_URL, FAUCET_URL } from "./util.test";

const apis = new WalletClient(NODE_URL, FAUCET_URL)


test("should be able to transfer", async () => {
    const alice = await apis.createWallet();
    var aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[0]);

    await apis.airdrop(aliceAccount.address().toString(), 20000);
    const bob = await apis.createWallet();
    
    var bobAccount = await apis.getAccountFromMetaData(bob.code, bob.accounts[0]);
    await apis.transfer(aliceAccount, bobAccount.address(), 15000);
    expect(await apis.getBalance(bobAccount.address())).toBe(15000);
    // const collection_name = "AliceCollection";
    // const token_name = "Alice Token";

    // // Create collection and token on Alice's account
    // await apis.createCollection(aliceAccount, collection_name, "Alice's simple collection", "https://aptos.dev");

    // console.log(await apis.createToken(
    //     aliceAccount,
    //     collection_name,
    //     token_name,
    //   "Alice's simple token",
    //   1,
    //   "https://aptos.dev/img/nyan.jpeg",
    // ));

    // console.log("TOKENS", await apis.getTokens(aliceAccount.address().toString()))

    console.log("hello", await apis.getTokens("0x107e49a8eb0484eb87621dc25d1d54194d606f914377e432e8c9e3847111e84b"))

    console.log(await apis.getSentEvents(bobAccount.address()))
    console.log(await apis.getBalance(bobAccount.address()));
    // console.log(await apis.transfer(bobAccount, aliceAccount.address(), 130));
    console.log(await apis.signGenericTransaction(bobAccount, "0x1::Coin::transfer", [aliceAccount.address().toString(), "130"], ["0x1::TestCoin::TestCoin"]))
    console.log(await apis.getBalance(bobAccount.address()))
    // console.log("alice address", aliceAccount.address(), "bob address", bobAccount.address())

    // console.log(await apis.accountTransactions(aliceAccount.address()))
}, 300000);


// test("should be able to create a new wallet and rotate auth keys", async () => {
//     var alice = await apis.createWallet();
//     console.log(alice);

//     var aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[0]);
//     await apis.airdrop(aliceAccount.address().toString(), 20000);

//     await apis.rotateAuthKey(alice.code, alice.accounts[0]);
//     alice = await apis.importWallet(alice.code);
//     console.log(alice);

//     await apis.createNewAccount(alice.code);
//     alice = await apis.importWallet(alice.code);

//     await apis.createNewAccount(alice.code);
//     alice = await apis.importWallet(alice.code);

//     await apis.createNewAccount(alice.code);
//     alice = await apis.importWallet(alice.code);

//     aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[2]);
//     await apis.airdrop(aliceAccount.address().toString(), 20000);

//     console.log(await apis.rotateAuthKey(alice.code, alice.accounts[2]));
//     alice = await apis.importWallet(alice.code);

//     aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[2]);
//     await apis.rotateAuthKey(alice.code, alice.accounts[2]);
//     alice = await apis.importWallet(alice.code);

//     aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[2]);
//     await apis.transfer(aliceAccount, alice.accounts[3].address, 100);
//     console.log(await apis.getBalance(aliceAccount.address().toString()));

//     console.log(await apis.getBalance(alice.accounts[3].address));
// },300000);
