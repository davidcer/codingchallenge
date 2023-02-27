// Selected ABIs for events
let abieswap= {
    signature:"Eswap(address,address,uint256)",
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
    "name": "Eswap",
    "type": "event"
        }]};

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
        }]};

// Helper: To parse logs
const processLogsWithInterface = async(abi, parselogs) => {

    
    let intrfc = new ethers.utils.Interface(JSON.stringify(abi));
  
    let parsedLog;
  
    parselogs.forEach((log) => {
          parsedLog = intrfc.parseLog(log);
      });
  
    return parsedLog;
  };


module.exports = {
        processLogsWithInterface: processLogsWithInterface,
        abitransfer: abitransfer,
        abieswap: abieswap
        
}
      