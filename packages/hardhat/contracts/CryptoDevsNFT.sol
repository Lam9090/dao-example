// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
contract CryptoDevsNFT is ERC721Enumerable,Ownable {
  using Strings for uint256;
  string _tokenBaseURI;

  uint public _price = 0.01 ether;

  // _paused used to paused the contract for emergency;
  bool public _paused;

  uint public maxTokenIds = 10;

  constructor(string memory baseURI)ERC721("CryptoDevs","CD") {
    _tokenBaseURI = baseURI;
  }

  modifier onlyWhenNotPaused {
    require(_paused == false, 'Currently unavailable: contract paused');
    _;
  }
  
  function mint()public onlyWhenNotPaused payable {
    uint totalTokenIds = totalSupply();
    require(totalTokenIds < maxTokenIds, 'Exceed maximum supply');
    require(msg.value >= _price, 'Insufficent eth to mint');
    _safeMint(msg.sender,totalTokenIds);
  }
  /// @dev overrider the ERC721 _baseURI function
  function _baseURI() internal view virtual override returns (string memory) {
    return _tokenBaseURI;
  }

  function tokenURI(uint tokenId) public view virtual override returns (string memory){
    require(_exists(tokenId), 'Token Id Do Not exist');
    string memory baseURI = _baseURI();

    return bytes(baseURI).length > 0? string(abi.encodePacked(baseURI,(tokenId).toString(),'.json')): '';
  }

  function setPaused(bool paused)public onlyOwner{
    _paused = paused;
  }

  function withDraw()public onlyOwner{
    address owner = owner();
    uint balance = address(this).balance;
    (bool sent,) = payable(owner).call{value:balance}("");
    require(sent,'withDraw(): Failed to send Eher');
  }

  receive() external payable {}

  fallback() external payable{}
}

