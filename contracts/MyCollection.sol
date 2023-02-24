pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyCollection is ERC721Burnable {

    string public baseTokenURI;
    
    using Counters for Counters.Counter;
    
    Counters.Counter private currentTokenId;
    
    uint256 public lastTokenID = 0;

    address public owner;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        baseTokenURI = "https://www/metadata/";
        owner = msg.sender;

    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function mint() public {
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();
        _safeMint(msg.sender, newItemId);
        lastTokenID = newItemId;
    }

    function burnoutside(uint256 tokenId) public virtual {
        //solhint-disable-next-line max-line-length
        //require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
        _burn(tokenId);
    }
}