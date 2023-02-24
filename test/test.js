const { ethers } = require("hardhat")
const {expect, assert} = require("chai")

// ABIs for events
let abieswap= {
    signature:"eswap(address,address,uint256)",
    abi:[{
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "msg_sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "collection",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_itemid",
        "type": "uint256"
      }
    ],
    "name": "eswap",
    "type": "event"
        }]}

  let abitransfer = {signature:"Transfer(address,address,uint256)",
    abi:
        [{
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
        }]}


  const processLogsWithInterface = async(abi, parselogs) => {

    
    let intrfc = new ethers.utils.Interface(JSON.stringify(abi));

    let parsedLog

    parselogs.forEach((log) => {
        parsedLog = intrfc.parseLog(log);
    })

    return parsedLog
}


describe("Add collection to contract", ()=> {

    let collection
    let match01
    let match02
    let match03
    let match04

    beforeEach(async()=>{
        
        let myCollection = await ethers.getContractFactory("MyCollection")

        match01 = await myCollection.deploy("match-01","m01");
        match02 = await myCollection.deploy("match-02","m02");
        match03 = await myCollection.deploy("match-03","m03");
        match04 = await myCollection.deploy("match-04","m04");

        await match01.deployed();
        await match02.deployed();
        await match03.deployed();
        await match04.deployed();

        let collectionAdmin = await ethers.getContractFactory("CollectionAdmin");
        collection = await collectionAdmin.deploy();

        await collection.addCollection(match01.address);
        await collection.addCollection(match02.address);
        await collection.addCollection(match03.address);
        await collection.addCollection(match04.address);

    })

    it ("should have all collections registered", async() => {

       
        expect(await collection.checkCollection(match01.address)).to.be.true
        expect(await collection.checkCollection(match02.address)).to.be.true
        expect(await collection.checkCollection(match03.address)).to.be.true
        expect(await collection.checkCollection(match04.address)).to.be.true

        expect(await collection.collectionLength()).is.equal(4)

    })

    it ("should remove collection when required", async() => {

        await collection.removeCollection(match04.address)
        expect(await collection.collectionLength()).is.equal(3)

        await collection.removeCollection(match01.address)
        await collection.removeCollection(match02.address)
        expect(await collection.collectionLength()).is.equal(1)

        await collection.addCollection(match01.address);
        await collection.addCollection(match02.address);
        await collection.addCollection(match04.address);

        expect(await collection.collectionLength()).is.equal(4)

    })

    it ("should swap NFT for something", async() => {
        

        let mint = await match01.mint() // NFT To SWAP

        let mint_tx = await mint.wait()
        
        // https://medium.com/@kaishinaw/ethereum-logs-hands-on-with-ethers-js-a28dde44cbb6
        let mint_tx_logs = await ethers.provider.getLogs({
            address: match01.address,
            topics: [ethers.utils.id(abitransfer.signature)],
            fromBlock: mint_tx.blockNumber,
            to: mint_tx.blockNumber,
        });

        let mintlog = await (processLogsWithInterface(abitransfer.abi,mint_tx_logs))

        let lastId = parseFloat(await mintlog.args.tokenId)

        let swap = await collection.swap(match01.address,lastId)

        let swap_tx = await swap.wait()

        swap_tx_logs = await ethers.provider.getLogs({
            address: collection.address,
            topics: [ethers.utils.id('eswap(address,address,uint256)')],
            fromBlock: 0 // swap_tx.blockNumber
        });

        let burnlog = await processLogsWithInterface(abieswap.abi,swap_tx_logs)

        console.log("burnlog",burnlog.args)

        let burnId = parseFloat(await burnlog.args._itemid)

        assert(lastId==burnId,"Asserting that the minted token was burned")


    })


})