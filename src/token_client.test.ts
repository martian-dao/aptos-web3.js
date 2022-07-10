import { FaucetClient } from "./faucet_client";
import { AptosAccount } from "./aptos_account";
import { AptosClient } from "./aptos_client";
import { TokenClient } from "./token_client";
// import { Types } from "./types";

import { FAUCET_URL, NODE_URL } from "./util.test";

test(
  "full tutorial nft token flow",
  async () => {
    const client = new AptosClient(NODE_URL);
    const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
    const tokenClient = new TokenClient(client);

    const alice = new AptosAccount();
    const bob = new AptosAccount();

    // Fund both Alice's and Bob's Account
    await faucetClient.fundAccount(alice.address(), 10000);
    await faucetClient.fundAccount(bob.address(), 5000);

    const collection_name = "AliceCollection";
    const token_name = "Alice Token";

    // Create collection and token on Alice's account
    await tokenClient.createCollection(alice, collection_name, "Alice's simple collection", "https://aptos.dev");

    console.log(await tokenClient.createToken(
      alice,
      "AliceCollection",
      "AliceToken",
      "Alice's simple token",
      1,
      "https://aptos.dev/img/nyan.jpeg",
    ));

    console.log("ALICE ADDRESS", alice.address())
    console.log("BOB ADDRESS", bob.address())

    // Transfer Token from Alice's Account to Bob's Account
    // console.log(await tokenClient.offerToken(alice, bob.address().hex(), alice.address().hex(), collection_name, token_name, 1));
    // await tokenClient.claimToken(bob, alice.address().hex(), alice.address().hex(), collection_name, token_name);
  },
  30 * 1000,
);
