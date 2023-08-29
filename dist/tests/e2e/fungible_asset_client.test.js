"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = require("../../account");
const providers_1 = require("../../providers");
const transaction_builder_1 = require("../../transaction_builder");
const utils_1 = require("../../utils");
const test_helper_test_1 = require("../unit/test_helper.test");
const plugins_1 = require("../../plugins");
const aptos_types_1 = require("../../aptos_types");
const provider = new providers_1.Provider(test_helper_test_1.PROVIDER_LOCAL_NETWORK_CONFIG);
const faucetClient = (0, test_helper_test_1.getFaucetClient)();
const publisher = new account_1.AptosAccount(new utils_1.HexString("0x1c2b344cdc1ca1cc33d5810cf93278fd3c2a8e8ba9cd78240c1193766b06a724").toUint8Array());
const alice = new account_1.AptosAccount();
const bob = new account_1.AptosAccount();
let fungibleAssetMetadataAddress = "";
// Do not run these tests if the network is testnet / mainnet right now.
let maybe;
if (process.env.NETWORK?.toLowerCase() == "testnet" || process.env.NETWORK?.toLowerCase() == "mainnet") {
    maybe = describe.skip;
}
else {
    maybe = describe;
}
/**
 * Since there is no ready-to-use fungible asset contract/module on an aptos framework address
 * we pre compiled the ../../../aptos-move/move-examples/fungible_asset/managed_fungible_token
 * contract and publish it here to local testnet so we can interact with it to mint a fungible
 * asset and then test FungibleAssetClient class
 */
maybe("fungible asset", () => {
    /**
     * Publish the fungible_token module
     * Mint 5 amount of fungible assets to Alice account
     * Get the asset address and store it to a later use
     */
    beforeAll(async () => {
        await faucetClient.fundAccount(publisher.address(), 100000000);
        await faucetClient.fundAccount(alice.address(), 100000000);
        await faucetClient.fundAccount(bob.address(), 100000000);
        // Publish contract
        const txnHash = await provider.publishPackage(publisher, new utils_1.HexString(
        // eslint-disable-next-line max-len
        "0d46756e6769626c65546f6b656e0100000000000000004045334431344231344134414439413146423742463233424534344546313232313739303138453736304544413330463346384344373435423338383138314237b6011f8b08000000000002ff858fbb0ec3200c4577be02b12769a5ae1dba64edd22d8a22024e94260504f42155fdf76240a85b652ff6b5cfb53bc3c5ca67e889e237a047cadabb9a9771838b5e4131f200eb16ad50d9d52118211d97d28273e07ac28dd76e986c587e6abbc6b1d79ee5be47c6a0c72b08ef92766064ca0e49c6f68054090694042516049f10d0fe70df74d3826f385ed74dc862da44b3aad48c7ed27a7ce15cdcff12e23d553e17295f4b33167a1e01000001166d616e616765645f66756e6769626c655f746f6b656eee0e1f8b08000000000002ffed59eb6edb3614fe9fa7e052c0930b217686b6ebd4a668bba55b81a5019a0cc5500c0a2d51361749f4482a4e1af8dd7778d18d92eca4698a025b7e04327578782edfb95193c904bdca11b9c4d932252862d98ce6349fa3a4c8e774064b580822055a51b940929d931c56eab77a650fbdcd915c5051f2f111b6b46cf637892482578520316cdd99c089199138c65211a188132c49cdb1c8a914c0e01cfbce31626f27637191d6c4a15e0f820ce7784ee2b0bd8eae7710fcc1c1082f251361c27146568c9f074145a9d50b82eb1392263e3aa2b97c4fe0e194e35c2484eb1faf0b9eeb87232bb78fded8fdafd4f6f5b3e1838c01aa038ef5cf4d1b969c66985fd5ba08c938a93708190701e19c71674dd0794e3a8b928337e1f842264f7d74a27fae1d22b69494e5ae4cda86a1915f048135f5b5f1579883c0b1a1f1ad0fed0e4148bcdec22c62690a4f702a3c9bcd09bd0486f58b673b9a8582cb719e5e3980ac21c456a0358a708e327c0e085ee07c4e002a6a73c47221d1e1bbe3d3f0f8c3bbc3f7012a9e3c420768df3237ef5f9d9c1c9e86277f1ebd3efe3d4017703ce3cf8ba72f8070b67b7a7872ba6bc91f7ce444b08247249c73562cc38c6433c23dfd03a8079d6fbcfeab221bff55a9f51b4b63c449227418b05c729642181194010ac14d3e92168508e7319a010a5564b2c40d4ea32cb8ba80503b32b1d002285a40cc9e932b1b11ea4f9d11c2e14185f9ea5579aa79dd8c848a44c9625e97b1a15fad6b9fbd8530a638a59f48c3552619286534a8b5b2ca004601d00a41f291a189720fc72064804606d8e386f029a85423456331b0d8063728a87bb35d4944930a29aaddf1b3161303cb0dfb4d2271b70e40d6ab08d49f16df6f2d0d4816131171aa837077dcdeb1dffee928dd7e69c238087296136fdc7bf242ca65309968a0a67826f620e14f6aa6cdd31d4be9505100631a1760a6513713783d3a6f14b96bea0db6a89df565f4d6fc1c95abe7fe345c65abf2b55e0d498e81a4517f745c7a8e1d5a06bcb50ada464e1234b8f4d1e4a17e440f27dd9dcdec6648c55536834ce310ffa0dfc52402c552d1cb6ac08e09bea0a0dd1efcdbbd85f977c7bd8687dcf1b36909548a9aa84c33a9f260992d719ab2950943c6d582e900744269db68af85e232eb017cdd0e604e20c928d796349ee3312720ca14b8895549b3855533e16e62d7a4dbc2b2ccb9b6e486268702f3b224554ccd9b0dec3276a14a7b1bcda3fe03dadeef2d45d79513fc96e27e6dd1750d8c665979f0f18292555d3fdf13093bb4cf711c436916aa36ea026a0e76c3452eb0fc5ed8ec1da3d582d8b6d5b695f0149365caae486c60b32c66298d74619a13a84b56676f1cd846ee79d911bef886aa93daaa150e4bb3d46eb7e9cb3acdbe775cfbb2dd463be9dc6df5bc919be1d1a8167cdc574f4a61ecf1c0cc0a549bd36b293076bb0bd5b3a8394439db3480e079a7cf68b9904077a57b488d3ea7b580692363452e757b08a8644109a831c2d13f0585c70130778d0ec66e63c5094c77542937e1422e18877e290e670cdafb950a05612baa61dd8147b88244a8770f952b989a0ade2957975448e149d6cf37c13d49489b6dd42ffd5e1dd1c6900d862e1f083026a0c753f3a4ce63433cdbb9a1d21586426cd937f0705a35ca9b3181c0df4c07d2992e21219ca97241955acf5042491a0f60a7a4eae027e12cab40d342500b5b5f1e4e4ee918dd04452dd33aae073dee062ac5e1ebc1d54557a55905af368c1afab530d5826d03576abae95c857c5ede51d56d1b6eee152a8d86e5663029377c1d88b8aed4a72b52af94c371df90cfde704260ea840b011c458a040986a854570439ab230631d54e46845e90fe79bae3c144330e2dd76e0d31ebf7583bbe70b0dfc98956dbed7e54651cfcf6091a8224c5732720ab58e405e9baf28f3c1976e61d3c59e4fffbf2fe7c99c0fcd8e3cc0f9092638e57f752a3955757f680cddd5d2be54223df76e47fb43ebb8e2e4d79a33a6a13b1ebef5f4ca7776feeb69d64c7dbade62bc18e87bff948fe1a6d52a709bf55b3fd5a6ba59d4ab3ac90eaee4bddcc104ef2889433b8beaa81e7b3d26e677b75bbae86ee0bb81d867522f45caef7d85b0a6a10e3000526778d21c386e629cd75be1f9a9cea7153edaa0152ad1b6374267943009961d40b909bc24771e7f23baf1c76a908b52066b2f5adaef510cc124fbf1fc3259dfebc039f8208cfa8106ab08e494e61d6ae3f658c1beeb55acf5336c3e9f33eb95e54623893ffc840c5b96751970b5e79bb76809c0b01fb09430f444018ceb0a0111404b6f2da37e4ccb5facd83aff91dc0f2722fa4cd6ae38ea3c7a2fd5b31e660d27ae3cbe9658223d2b884d4d3aeddeca3fde9d477cfebbb6fd990284a340c4534380e43f078ce296528a3830323c5a36654b77b984adc6149b74941852def4372f8e871835d350e0f1dedb74dad2cf919367178342de2a327cdbbe34e5f770b9b7c7707a3fcd80c4635e70d1be4a7693ba16e0b366bc21aa536fa1e7c24974b8864757182690ae5c0c39007247c8e8a09504f2f1f4fa7d37d1fa52cc2fa86f100a94fd06ef07673cc9618d636532255ebdf4a689b9b3d25dac6905defac77fe05f79b78dcf720000000000400000000000000000000000000000000000000000000000000000000000000010e4170746f734672616d65776f726b00000000000000000000000000000000000000000000000000000000000000010b4170746f735374646c696200000000000000000000000000000000000000000000000000000000000000010a4d6f76655374646c69620000000000000000000000000000000000000000000000000000000000000004114170746f73546f6b656e4f626a6563747300").toUint8Array(), [
            new transaction_builder_1.TxnBuilderTypes.Module(new utils_1.HexString(
            // eslint-disable-next-line max-len
            "a11ceb0b060000000c010016021634034aaa0104f40116058a028c03079605fb0508910b6006f10bb20210a30ea1010ac40f0c0cd00fef040dbf14060000010101020103010401050106010702080209020a000b0800020d00000310070100010211080002190600021b0600021d0600021e080007270700032c0200092d0b00042e07010000000c000100000e020100000f030100001201040000130501000014060100001507010000160301000017060800061f050a0003200c0d010801210e0e0003220f0a01080523101101080224130101080225150101080226170101080728191a000a291b1900032a1c0a00032b0a1d0108042f0120010008302122000a3123220005322501000233262700023426280002352629000336262a0002142c080002372e0101080238300801080a0b0c0b0d0b0e120f121012140b151f15241e121f1203060c05030003060c05080102060c05010b0201080301060c03060c030504060c050503010801050b020108030b020108030608060b02010807060c0105010803020b02010900050101010301060b0201090002050b02010900010b02010807010807030608060b0201090003050b020108030b02010803060c0b02010807060805030608050b020109000801050b020108030b02010803060c0608050b02010807030608050b0201090001030508080808010a02010808020608080608080206050a02010b02010900080809080608080608090c08040808080501080a010b0b01090006060c08080308080b0b01080a080801080906060c0808080808080b0b01080a08080104070608090b0b010408080808020808080801060809010804010806010805010c060b020108030b020108030801060800060c0b020108070206080403060b020108030b020108030b02010807060c0b02010807060805040608050b020109000b0201090003050b020108030b020108030b02010807060c060805030608050b0201090003166d616e616765645f66756e6769626c655f746f6b656e056572726f720e66756e6769626c655f6173736574066f626a656374066f7074696f6e167072696d6172795f66756e6769626c655f73746f7265067369676e657206737472696e670a636f6c6c656374696f6e07726f79616c747905746f6b656e144d616e6167656446756e6769626c654173736574046275726e0d46756e6769626c654173736574076465706f7369740e667265657a655f6163636f756e74064f626a656374084d657461646174610c6765745f6d657461646174610b696e69745f6d6f64756c65046d696e74087472616e7366657210756e667265657a655f6163636f756e74087769746864726177086d696e745f726566074d696e745265660c7472616e736665725f7265660b5472616e73666572526566086275726e5f726566074275726e5265660d46756e6769626c6553746f72650a616464726573735f6f660869735f6f776e6572117065726d697373696f6e5f64656e6965640e6f626a6563745f616464726573731b656e737572655f7072696d6172795f73746f72655f657869737473096275726e5f66726f6d106465706f7369745f776974685f7265660f7365745f66726f7a656e5f666c616706537472696e670475746638116372656174655f746f6b656e5f73656564156372656174655f6f626a6563745f6164647265737311616464726573735f746f5f6f626a6563740e436f6e7374727563746f7252656607526f79616c7479064f7074696f6e046e6f6e65176372656174655f66697865645f636f6c6c656374696f6e126372656174655f6e616d65645f746f6b656e2b6372656174655f7072696d6172795f73746f72655f656e61626c65645f66756e6769626c655f61737365741167656e65726174655f6d696e745f7265661167656e65726174655f6275726e5f7265661567656e65726174655f7472616e736665725f7265660f67656e65726174655f7369676e6572117472616e736665725f776974685f7265661177697468647261775f776974685f726566d6921a4cfe909980a4012c004e13e5ae6a9e535dbe177b52f24f7fc64b36cb52000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000040a02050454455354030801000000000000000a0215147465737420636f6c6c656374696f6e206e616d650a02100f7465737420746f6b656e206e616d650520d6921a4cfe909980a4012c004e13e5ae6a9e535dbe177b52f24f7fc64b36cb520a021c1b7465737420636f6c6c656374696f6e206465736372697074696f6e0a02201f687474703a2f2f6170746f736c6162732e636f6d2f636f6c6c656374696f6e0a0217167465737420746f6b656e206465736372697074696f6e0a021b1a687474703a2f2f6170746f736c6162732e636f6d2f746f6b656e0a021918746573742066756e6769626c65206173736574206e616d650a022120687474703a2f2f6170746f736c6162732e636f6d2f66617669636f6e2e69636f0a021615687474703a2f2f6170746f736c6162732e636f6d2f126170746f733a3a6d657461646174615f76318c010101000000000000000a454e4f545f4f574e4552344f6e6c792066756e6769626c65206173736574206d65746164617461206f776e65722063616e206d616b65206368616e6765732e01144d616e6167656446756e6769626c654173736574010301183078313a3a6f626a6563743a3a4f626a65637447726f7570010c6765745f6d657461646174610101000002031808041a08051c08060001040100091d11030c030b000a030c040c070a040b0711093800040c050f0701110b270e0438012b0010000c050b010b0338020c060b050b060b023803020101000100141d11030c030b000a030c040c050a040b0511093800040c050f0701110b270e0438012b0010010c070b010b0338020c060b070b060b023804020201040100161d11030c020b000a020c030c040a030b0411093800040c050f0701110b270e0338012b0010010c050b010b0238020c060b050b060838050203010000180f070211110c01070311110c0207040c000e000e010e0211121113380602040000001e3b070211110c03070311110c070a00070511110601000000000000000a033807070611111116010b000b03070711110b0738070708111111170c010e010c040a04380807091111070011113102070a1111070b111111180a0411190c060a04111a0c020a04111b0c080b04111c0c050e050b060b080b0212002d000205010401002b2211030c030b000a030c040c070a040b0711093800040c050f0701110b270e0438012b000c060b020b0338020c080a0610020b01111d0c050b0610010b080b0538040206010401002d2211030c040b000a040c050c070a050b0711093800040c050f0701110b270e0538012b0010010c090b010a0438020c060b020b0438020c080b090b060b080b033809020701040100161d11030c020b000a020c030c040a030b0411093800040c050f0701110b270e0338012b0010010c050b010b0238020c060b050b060938050208010001002f1d11030c030b000a030c040c060a040b0611093800040c050f0701110b270e0438012b0010010c070b020b0338020c050b070b050b01380a0200020001000000").toUint8Array()),
        ]);
        await provider.waitForTransaction(txnHash, { checkSuccess: true });
        // Mint 5 fungible assets to Alice
        const payload = {
            function: `${publisher.address().hex()}::managed_fungible_token::mint`,
            type_arguments: [],
            arguments: [5, alice.address().hex()],
        };
        const rawTxn = await provider.generateTransaction(publisher.address(), payload);
        const bcsTxn = providers_1.AptosClient.generateBCSTransaction(publisher, rawTxn);
        const transactionRes = await provider.submitSignedBCSTransaction(bcsTxn);
        await provider.waitForTransaction(transactionRes.hash, { checkSuccess: true });
        // Get the asset address
        const viewPayload = {
            function: `${publisher.address().hex()}::managed_fungible_token::get_metadata`,
            type_arguments: [],
            arguments: [],
        };
        const metadata = await provider.view(viewPayload);
        fungibleAssetMetadataAddress = metadata[0].inner;
    }, test_helper_test_1.longTestTimeout);
    /**
     * Test `transfer` and `getPrimaryBalance` functions in `FungibleAssetClient` class
     */
    test("it trasfers amount of fungible asset and gets the correct balance", async () => {
        const fungibleAsset = new plugins_1.FungibleAssetClient(provider);
        // Alice has 5 amounts of the fungible asset
        const aliceInitialBalance = await fungibleAsset.getPrimaryBalance(alice.address(), fungibleAssetMetadataAddress);
        expect(aliceInitialBalance).toEqual(BigInt(5));
        // Alice transfers 2 amounts of the fungible asset to Bob
        const transactionHash = await fungibleAsset.transfer(alice, fungibleAssetMetadataAddress, bob.address(), 2);
        await provider.waitForTransaction(transactionHash, { checkSuccess: true });
        // Alice has 3 amounts of the fungible asset
        const aliceCurrentBalance = await fungibleAsset.getPrimaryBalance(alice.address(), fungibleAssetMetadataAddress);
        expect(aliceCurrentBalance).toEqual(BigInt(3));
        // Bob has 2 amounts of the fungible asset
        const bobBalance = await fungibleAsset.getPrimaryBalance(bob.address(), fungibleAssetMetadataAddress);
        expect(bobBalance).toEqual(BigInt(2));
    }, test_helper_test_1.longTestTimeout);
    /**
     * Test `transfer` and `checkBalance` functions in `CoinClient` class
     */
    test("coin client supports fungible assets operations", async () => {
        const coinClient = new plugins_1.CoinClient(provider.aptosClient);
        // Test `transferFromPrimaryFungibleStore` and `checkBalance`
        // Alice transfers 2 more amount of fungible asset to Bob
        await provider.waitForTransaction(await coinClient.transfer(alice, bob, 2, {
            coinType: fungibleAssetMetadataAddress,
        }), { checkSuccess: true });
        // Bob balance is now 4
        expect(await coinClient.checkBalance(bob, {
            coinType: fungibleAssetMetadataAddress,
        })).toEqual(BigInt(4));
    }, test_helper_test_1.longTestTimeout);
    /**
     * Test `transfer` fungible token in `AptosToken` class
     */
    test("aptos_token supports transfer fungible token", async () => {
        const aptosToken = new plugins_1.AptosToken(provider);
        const getTokenDataSpy = jest.spyOn(provider, "getTokenData");
        const getTokenDataSpyResponse = { current_token_datas_v2: new Array() };
        getTokenDataSpyResponse.current_token_datas_v2.push({ is_fungible_v2: true });
        getTokenDataSpy.mockResolvedValue(getTokenDataSpyResponse);
        await provider.waitForTransaction(await aptosToken.transfer({
            owner: alice,
            tokenAddress: fungibleAssetMetadataAddress,
            recipient: bob.address(),
            amount: 1,
        }), {
            checkSuccess: true,
        });
        // Bob balance is now 5
        const fungibleAsset = new plugins_1.FungibleAssetClient(provider);
        const bobBalance = await fungibleAsset.getPrimaryBalance(bob.address(), fungibleAssetMetadataAddress);
        expect(bobBalance).toEqual(BigInt(5));
    }, test_helper_test_1.longTestTimeout);
    test("aptos_token supports transfer fungible token when isFungibleToken param set to true", async () => {
        const aptosToken = new plugins_1.AptosToken(provider);
        await provider.waitForTransaction(await aptosToken.transfer({
            owner: bob,
            tokenAddress: fungibleAssetMetadataAddress,
            recipient: alice.address(),
            amount: 1,
        }, true), {
            checkSuccess: true,
        });
        // Bob balance is now 4
        const fungibleAsset = new plugins_1.FungibleAssetClient(provider);
        const bobBalance = await fungibleAsset.getPrimaryBalance(bob.address(), fungibleAssetMetadataAddress);
        expect(bobBalance).toEqual(BigInt(4));
    }, test_helper_test_1.longTestTimeout);
    test("it generates and returns a transferFromPrimaryFungibleStore raw transaction", async () => {
        const fungibleAsset = new plugins_1.FungibleAssetClient(provider);
        const rawTxn = await fungibleAsset.generateTransfer(alice, fungibleAssetMetadataAddress, bob.address(), 2);
        expect(rawTxn instanceof aptos_types_1.RawTransaction).toBeTruthy();
        expect(rawTxn.sender.toHexString()).toEqual(alice.address().hex());
    });
});
//# sourceMappingURL=fungible_asset_client.test.js.map