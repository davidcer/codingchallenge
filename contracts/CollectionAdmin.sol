pragma solidity >=0.8.2 <0.9.0;

import "./MyCollection.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract CollectionAdmin is  AccessControl {

    address public owner;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event eswap(address msg_sender,address collection,uint256 itemId);


    MyCollection[] public collection;

    MyCollection public swapreceipt;

    constructor() {

        owner = msg.sender;
        
        _grantRole(ADMIN_ROLE, owner);

        swapreceipt = new MyCollection("swapreceit","swprcp");

    }

    function collectionLength() public view returns (uint) {

        return collection.length;

    }

    function show(uint i) public view returns (address) {

        return address(collection[i]);

    }

    function addCollection (address _address) public onlyRole(ADMIN_ROLE) returns (MyCollection) {

        require(checkCollection(_address)==false,"collecion already exists");

        MyCollection _newcol = MyCollection(_address);

        collection.push(_newcol);

        return _newcol;

    }

    function checkCollection (address _address) public view returns (bool) {

        for (uint i = 0; i < collection.length; i++) {

            if (address(collection[i]) == _address) {
        
                return true;
        
            }

        }

        return false;
    
    }

     function removeCollection (address _address) public onlyRole(ADMIN_ROLE) returns (bool) {

        require(checkCollection(_address),"Collection does not exists");

        uint colindex = getCollectionIndex(_address);

        collection[colindex] = collection[collection.length - 1];

        collection.pop();

        return true;

    }

    function getCollectionIndex(address _address) internal view returns (uint) {
            
        uint i = 0;
        for (i; i < collection.length; i++) {
                
                if (collection[i] == MyCollection(_address)) {
                    
                    return i;
                }
            }
        
        if (collection[i] == MyCollection(_address)) {
                    
                    return i;
                }
    }


    function swap(address _address, uint256 _itemId) public {
        
        if (checkCollection(_address)) {

            MyCollection _collection = MyCollection(_address);

            require(msg.sender==_collection.ownerOf(_itemId));

            _collection.burnoutside(_itemId);
            
            emit eswap(msg.sender,_address,_itemId);

        }
    }
}
