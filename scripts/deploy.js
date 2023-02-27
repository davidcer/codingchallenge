const hre = require("hardhat");

async function main() {

    const myCollection = await hre.ethers.getContractFactory("MyCollection");
    const collectionAdmin = await hre.ethers.getContractFactory("CollectionAdmin");
    
    const match01 = await myCollection.deploy("match-01","m01");
    const match02 = await myCollection.deploy("match-02","m02");
    const match03 = await myCollection.deploy("match-03","m03");
    const match04 = await myCollection.deploy("match-04","m04");

    const collection = await collectionAdmin.deploy();

    await collection.addCollection(match01.address);
    await collection.addCollection(match02.address);
    await collection.addCollection(match03.address);
    await collection.addCollection(match04.address);
    
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
