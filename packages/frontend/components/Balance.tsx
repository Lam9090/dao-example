"use client";
import { useState } from "react";
import { formatEther } from "viem/utils";
import { useAccount, useChainId, useConfig, useWriteContract } from "wagmi";
import deployedContracts from "@/contracts/deployedContracts";
import { sepolia } from "viem/chains";
import { getBalanceQueryOptions, readContractQueryOptions } from "wagmi/query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCryptoDevsNFTBalanceOf } from "@/services/queries";

export const NFTBalance = () => {
  const { address } = useAccount();

  const chainId = useChainId() as typeof sepolia.id;

  const {  CryptoDevsNFTDao } =
    deployedContracts[chainId];

  // Fetch the owner of the DAO

  const config = useConfig();


  // Fetch the balance of the DAO
  const daoBalance = useSuspenseQuery(
    getBalanceQueryOptions(config, { address: CryptoDevsNFTDao.address })
  );
  // Fetch the number of proposals in the DAO
  const numOfProposalsInDAO = useSuspenseQuery(
    readContractQueryOptions(config, {
      abi: CryptoDevsNFTDao.abi,
      address: CryptoDevsNFTDao.address,
      functionName: "size",
    })
  );

  // Fetch the CryptoDevs NFT balance of the user
  const nftBalanceOfUser = useCryptoDevsNFTBalanceOf(address!)
  return (
    <div>
      <h1>Welcome to Crypto Devs!</h1>
      <div>Welcome to the DAO!</div>
      <div>
        Your CryptoDevs NFT Balance: {nftBalanceOfUser?.data?.toString()}
        <br />
        {daoBalance.data && (
          <>
            Treasury Balance: {formatEther(daoBalance.data.value).toString()}{" "}
            ETH
          </>
        )}
        <br />
        Total Number of Proposals: {numOfProposalsInDAO?.data?.toString()}
      </div>
    </div>
  );
};
