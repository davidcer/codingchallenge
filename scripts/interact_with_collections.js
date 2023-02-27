const hre = require("hardhat");

const MyCollectionJson = require("../artifacts/contracts/MyCollection.sol/MyCollection.json");
const myCollectionAbi = MyCollectionJson.abi;

const CollectionAdminJson = require("../artifacts/contracts/CollectionAdmin.sol/CollectionAdmin.json");
const collectionAbi = CollectionAdminJson.abi;

const {abieswap, abitransfer, processLogsWithInterface} = require("./../helpers/parser");


async function main() {


    // Setting up enviroment
    const alchemy = new hre.ethers.providers.AlchemyProvider('maticmum', process.env.ALQ_PRIVATE_KEY);
    const userWallet = new hre.ethers.Wallet(process.env.WALLET_SECRET_KEY, alchemy);

    const collectionAdmin = new hre.ethers.Contract(process.env.COLLECTION_ADMIN_ADDRESS, collectionAbi, userWallet);


    // Deploy collections if not exists
    if (await collectionAdmin.checkCollection(process.env.MATCH01_ADDRESS))
        {console.log("collection exists", process.env.MATCH01_ADDRESS)}
        else
        {await collectionAdmin.addCollection(process.env.MATCH01_ADDRESS);}

    if (await collectionAdmin.checkCollection(process.env.MATCH02_ADDRESS))
        {console.log("collection exists", process.env.MATCH02_ADDRESS)}
        else
        {await collectionAdmin.addCollection(process.env.MATCH02_ADDRESS);}

    if (await collectionAdmin.checkCollection(process.env.MATCH03_ADDRESS))
        {console.log("collection exists", process.env.MATCH03_ADDRESS)}
        else
        {await collectionAdmin.addCollection(process.env.MATCH03_ADDRESS);}

    if (await collectionAdmin.checkCollection(process.env.MATCH04_ADDRESS))
        {console.log("collection exists", process.env.MATCH04_ADDRESS)}
        else
        {await collectionAdmin.addCollection(process.env.MATCH04_ADDRESS);}

    // Mint and burn
    const match01 = new hre.ethers.Contract(process.env.MATCH01_ADDRESS, myCollectionAbi, userWallet);
    
    let mint = await match01.mint(); // NFT To SWAP

    let mint_tx = await mint.wait();
    
    let mint_tx_logs = await ethers.provider.getLogs({
            address: match01.address,
            topics: [ethers.utils.id(abitransfer.signature)],
            fromBlock: mint_tx.blockNumber,
            to: mint_tx.blockNumber,
        });

    let mintlog = await (processLogsWithInterface(abitransfer.abi,mint_tx_logs));

    let lastId = parseFloat(await mintlog.args.tokenId);

    let swap = await collectionAdmin.swap(match01.address,lastId);

    let swap_tx = await swap.wait();

    let swap_tx_logs = await ethers.provider.getLogs({
            address: collectionAdmin.address,
            topics: [ethers.utils.id(abieswap.signature)],
            fromBlock: swap_tx.blockNumber
        });

    let burnlog = await processLogsWithInterface(abieswap.abi,swap_tx_logs);

    let burnId = parseFloat(await burnlog.args._itemid);

    console.log("NFT Burn and Minted:", burnId)
    
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});




// npx hardhat run scripts/deploy.js --network mumbai