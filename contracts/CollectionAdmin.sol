//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./MyCollection.sol";

import "hardhat/console.sol";


contract CollectionAdmin is  AccessControl {

    address public owner;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event Eswap(address msgSender, address collection, uint256 itemId);

    event TagUint(string tag, uint256 itemId);

    // Collections are added to collection on this array
    MyCollection[] public collection;

constructor() {

    owner = msg.sender;

    _grantRole(ADMIN_ROLE, owner);

}

function collectionLength() public view returns (uint) {

    return collection.length;

}

function addCollection (address _address) public onlyRole(ADMIN_ROLE) {

    require(checkCollection(_address)==false,"collection already exists");

    MyCollection _newcol = MyCollection(_address);

    collection.push(_newcol);

    emit TagUint("new collection added on position",collection.length);

}

function checkCollection (address _address) public view returns (bool) {

    for (uint i = 0; i < collection.length; i++) {

        if (address(collection[i]) == _address) {
        
            return true;
        
        }

    }

    return false;
    
}

function removeCollection (address _address) public onlyRole(ADMIN_ROLE) {

    require(checkCollection(_address),"Collection does not exists");

    uint colindex = getCollectionIndex(_address);

    collection[colindex] = collection[collection.length - 1];

    collection.pop();

    emit TagUint("new collection removed from position",colindex);

    }

function getCollectionIndex(address _address) internal view returns (uint) {
            
    uint i = 0;

    for (i; i < collection.length; i++) {
                
        if (collection[i] == MyCollection(_address)) {
                    
            return i;
            
        }
    }

}


function swap(address _address, uint256 _itemId) public {
        
    // validations:
    // * Collection exists
    // * msg sender is collectible owner

    if (checkCollection(_address)) {

        MyCollection _collection = MyCollection(_address);

        require(msg.sender==_collection.ownerOf(_itemId));

        _collection.burnoutside(_itemId);
            
        emit Eswap(msg.sender,_address,_itemId);

        // There is no rule to swap

    }
}

}
