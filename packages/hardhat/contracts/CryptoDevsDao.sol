// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ICryptoDevsNFT {
	/// @dev balanceof() returns the number of NFTs owned by the given address
	/// @param owner - the address to get the balance for
	/// @return Returns the number of NFTs owned
	function balanceOf(address owner) external view returns (uint);

	/// @dev tokenOfOwnerByIndex() returns the tokenId at the given index for owner
	/// @param owner - the address to fetch the tokenId for;
	/// @param index - index of NFT in owned tokens array to fetch
	/// @return Returns the tokenId
	function tokenOfOwnerByIndex(
		address owner,
		uint index
	) external view returns (uint);
}

interface IFakeNFTMarketplace {
	/// @dev getPrice() returns the price of an NFT.
	/// @return Returns a boolean value - true if available, false if not
	function getPrice() external view returns (uint);

	/// @dev available() checks whether the given tokenId of NFT has been purchased;
	/// @param _tokenId - the tokenId
	function available(uint _tokenId) external view returns (bool);
	/// @dev purchase() purchases the given tokenId of NFT from FakeNFTMarketplace
	/// @param _tokenId the fake tokenId to be purchased
	function purchase(uint _tokenId) external payable;
}

// What a proposal would looks like;
struct Proposal {
	// nftTokenId - the TokenId of the NFT to purchase from FakeNFTMarketplace if the proposal passed;
	uint nftTokenId;
	// deadline - the UNIX timestamp until which this proposal is active;
	// proposal can be excuted after the deealine has been exceeded
	uint deadline;
	// approvals - the number of voters appove this proposal
	uint approvals;
	// rejections - the number of voters against this proposal
	uint rejections;
	// excuted - whether or not this proposal has beed excuted yet;
	// proposal only can be excuted after the dealline has beed exceeded
	bool excuted;
	// voters - a mapping of CryptoDevs NFT tokenId to booleans indicating whether the token of NFT has already been used to cast a vote or not;
	mapping(uint => bool) voters;
}

/* DevNFTDao has the functionality we need:
    1.Allow holders of CryptoDevs NFT to create a new proposal
    2.Allow holders of CryptoDevs NFT to vote on proposal
    3.Allow holders of CryptoDevs NFT to excute an proposal after deadline has passed if proposal passed
    4.Store all the proposals in the contract;
*/
contract CryptoDevsNFTDao is Ownable {
	// proposals - a mapping of Proposal Id to Proposal
	mapping(uint => Proposal) public proposals;

	// size - a size of the proposals mapping, indicating how many proposals has been created;
	uint public size;

	ICryptoDevsNFT cryptoDevsNFT;

	IFakeNFTMarketplace nftMarketplace;

	constructor(address _nftMarketplace, address _cryptoDevsNFT) {
		cryptoDevsNFT = ICryptoDevsNFT(_cryptoDevsNFT);
		nftMarketplace = IFakeNFTMarketplace(_nftMarketplace);
	}

	modifier nftHolderOnly() {
		require(cryptoDevsNFT.balanceOf(msg.sender) > 0, "Not a Dao Member");
		_;
	}

	/// @dev createProposal() allow holders of CryptoDevs to create a new proposal in the DAO
	/// @param _nftTokenId - the tokenId of NFT to be purchased from nftMarketplace if proposal passed;
	/// @return Returns the proposal index for the newly created proposal;
	function createProposal(
		uint _nftTokenId
	) external nftHolderOnly returns (uint) {
		require(
			nftMarketplace.available(_nftTokenId),
			"NFT Token Not Available"
		);

		Proposal storage proposal = proposals[size];
		proposal.nftTokenId = _nftTokenId;
		// set the proposal voting deadline to be (currentTime + 5 minutes;)
		proposal.deadline = block.timestamp + 5 minutes;

		size++;
		return size - 1;
	}

	// a modifier which only allow a function to be called
	// if the deadline of the given proposal with the proposalId has not beed exceeded yet;
	modifier activeProposalOnly(uint proposalId) {
		require(
			proposals[proposalId].deadline > block.timestamp,
			"Proposal deadline exceeded"
		);
		_;
	}

	enum Vote {
		Approve,
		Reject
	}

	event voteProposal(string msg, address _address, uint tokenId, bool voted);
	function voteOnProposal(
		uint proposalId,
		Vote vote
	) external nftHolderOnly activeProposalOnly(proposalId) {
		Proposal storage proposal = proposals[proposalId];

		uint voterNFTBalance = cryptoDevsNFT.balanceOf(msg.sender);
		uint numVotes = 0;

		for (uint i = 0; i < voterNFTBalance; i++) {
			uint tokenId = cryptoDevsNFT.tokenOfOwnerByIndex(msg.sender, i);
			emit voteProposal(
				"vote proposal",
				msg.sender,
				tokenId,
				proposal.voters[tokenId]
			);
			if (proposal.voters[tokenId] == false) {
				numVotes++;
				proposal.voters[tokenId] = true;
			}
		}
		require(numVotes > 0, "ALREADY_VOTED");

		if (vote == Vote.Approve) {
			proposal.approvals += numVotes;
		} else {
			proposal.rejections += numVotes;
		}
	}

	// a modifier which only allow a function to be called
	// if the deadline of the proposal with the given proposalId has been exceeded and not bee excuted yet;
	modifier inActiveProposalOnly(uint proposalId) {
		require(
			proposals[proposalId].deadline <= block.timestamp,
			"Proposal deadline not exceeded"
		);
		require(
			proposals[proposalId].excuted == false,
			"Proposal has beed excuted"
		);
		_;
	}

	function excuteProposal(
		uint proposalId
	) external nftHolderOnly inActiveProposalOnly(proposalId) {
		Proposal storage proposal = proposals[proposalId];

		if (proposal.approvals > proposal.rejections) {
			uint price = nftMarketplace.getPrice();
			require(address(this).balance >= price, "Not enough founds");
			nftMarketplace.purchase{ value: price }(proposal.nftTokenId);
		}
		proposal.excuted = true;
	}

	function withdrawEther() external onlyOwner {
		uint amount = address(this).balance;
		address owner = owner();
		require(amount > 0, "Nothing to withdraw, contract balance empty");
		(bool sent, ) = payable(owner).call{ value: amount }("");
		require((sent), "FAILED_TO_WITHDRAW_ETHER");
	}

	event Log(string msg, uint amount, address sender);
	receive() external payable {
		emit Log("receive called", msg.value, msg.sender);
	}
	fallback() external payable {
		emit Log("fallback called", msg.value, msg.sender);
	}
}
