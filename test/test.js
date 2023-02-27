const { ethers } = require("hardhat")
const {assert, expect} = require("chai")

const {abieswap, abitransfer, processLogsWithInterface} = require("./../helpers/parser");

// Tests
describe("Add collection to contract", ()=> {

    let collection;
    let match01;
    let match02;
    let match03;
    let match04;

    beforeEach(async()=>{
        
        let myCollection = await ethers.getContractFactory("MyCollection");

        match01 = await myCollection.deploy("match-01","m01");
        match02 = await myCollection.deploy("match-02","m02");
        match03 = await myCollection.deploy("match-03","m03");
        match04 = await myCollection.deploy("match-04","m04");

        await match01.deployed();
        await match02.deployed();
        await match03.deployed();
        await match04.deployed();

        collectionAdmin = await ethers.getContractFactory("CollectionAdmin");
        collection = await collectionAdmin.deploy();

        await collection.addCollection(match01.address);
        await collection.addCollection(match02.address);
        await collection.addCollection(match03.address);
        await collection.addCollection(match04.address);

    });

    it ("should have all collections registered", async() => {

        expect(await collection.checkCollection(match01.address)).to.be.true;
        expect(await collection.checkCollection(match02.address)).to.be.true;
        expect(await collection.checkCollection(match03.address)).to.be.true;
        expect(await collection.checkCollection(match04.address)).to.be.true;

        expect(await collection.collectionLength()).is.equal(4);

    });

    it ("should remove collection when required", async() => {

        await collection.removeCollection(match04.address);
        expect(await collection.collectionLength()).is.equal(3);

        await collection.removeCollection(match01.address);
        await collection.removeCollection(match02.address);
        expect(await collection.collectionLength()).is.equal(1);

        await collection.addCollection(match01.address);
        await collection.addCollection(match02.address);
        await collection.addCollection(match04.address);

        expect(await collection.collectionLength()).is.equal(4);

    });

    it ("should swap NFT for something", async() => {
        

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

        let swap = await collection.swap(match01.address,lastId);

        let swap_tx = await swap.wait();

        let swap_tx_logs = await ethers.provider.getLogs({
            address: collection.address,
            topics: [ethers.utils.id(abieswap.signature)],
            fromBlock: swap_tx.blockNumber
        });

        let burnlog = await processLogsWithInterface(abieswap.abi,swap_tx_logs);

        let burnId = parseFloat(await burnlog.args._itemid);

        assert(lastId==burnId,"Asserting that the minted token was burned");


    });


});