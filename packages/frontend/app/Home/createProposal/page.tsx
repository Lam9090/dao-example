"use client";

import { useContracts, useCryptoDevsNFTBalanceOf } from "@/services/queries";
import { queryClient } from "@/services/queryClient";
import { wagmiConfigWithWallets } from "@/services/web3/wagmiConfig";
import { Address } from "abitype";
import React, { useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

const CreateProposal = () => {
  const { address } = useAccount();
  const nftBalanceOfUser = useCryptoDevsNFTBalanceOf(address!);

  const [tokenId, setTokenId] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();

  const { CryptoDevsNFTDao, CryptoDevsNFT } = useContracts();

  async function createProposal() {
    if (!tokenId) {
      console.error("Invalid Token Id");
      return;
    }
    try {
      const tx = await writeContractAsync({
        address: CryptoDevsNFTDao.address,
        abi: CryptoDevsNFTDao.abi,
        functionName: "createProposal",
        args: [BigInt(tokenId)],
      });

      await waitForTransactionReceipt(wagmiConfigWithWallets, { hash: tx });
      window.alert('success')
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
  }

  async function buyNft() {
    try {
      const tx = await writeContractAsync({
        address: CryptoDevsNFT.address,
        abi: CryptoDevsNFT.abi,
        functionName: "mint",
      });
      await waitForTransactionReceipt(wagmiConfigWithWallets, { hash: tx });

    } catch (error) {
      console.error(error);
      window.alert(error);
    }
  }
  if (nftBalanceOfUser.data === BigInt(0)) {
    return (
      <div>
        You do not own any CryptoDevs NFTs. <br />
        <b>You cannot create or vote on proposals</b>
        <div>
          But you could
          <button className="text-red-500" onClick={buyNft}>
            Buy one
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <button className="text-red-500" onClick={buyNft}>
        Mint NFT
      </button>
      <label>Fake NFT Token ID to Purchase: </label>
      <input
        placeholder="0"
        type="number"
        onChange={(e) => setTokenId(e.target.value)}
      />
      <button disabled={!tokenId} onClick={createProposal}>
        Create
      </button>
    </div>
  );
};

export default CreateProposal;
