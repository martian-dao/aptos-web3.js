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
});


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

//     await apis.rotateAuthKey(alice.code, alice.accounts[2]);
//     alice = await apis.importWallet(alice.code);

//     aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[2]);
//     await apis.rotateAuthKey(alice.code, alice.accounts[2]);
//     alice = await apis.importWallet(alice.code);

//     aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[2]);
//     await apis.transfer(aliceAccount, alice.accounts[3].address, 100);
//     console.log(await apis.getBalance(aliceAccount.address().toString()));

//     console.log(await apis.getBalance(alice.accounts[3].address));
// }, 50 * 1000,);
