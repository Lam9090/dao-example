// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

contract FakeNFTMarketplace {
  // @dev Maintain a mapping of Fake TokenId to Owner address
  mapping (uint => address) public tokens;

  uint nftPrice = 0.1 ether;


  // @dev purchase() accept ETH and marks the owner of the given TokenId as the caller address
  // @params _tokenId - the fake TokenId to purchas
  function purchase(uint _tokenId) external payable {
    require(msg.value == nftPrice,'This NFT costs 0.1 ether');
    tokens[_tokenId] = msg.sender;
  }

  // @dev getPrice() return the price of the NFT
  function getPrice()external view returns (uint){
    return nftPrice;
  }

  //@dev available() checks whether the given tokenId has been purchased or not
  function available (uint _tokenId) external view returns (bool){
    if (tokens[_tokenId] == address(0)){
      return true;
    }
    return false;
  }
}