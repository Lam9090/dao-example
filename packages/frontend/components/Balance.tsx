"use client";
import { formatEther } from "viem/utils";
import { useAccount, useChainId, useConfig } from "wagmi";
import deployedContracts from "@/contracts/deployedContracts";
import { sepolia } from "viem/chains";
import { getBalanceQueryOptions, readContractQueryOptions } from "wagmi/query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCryptoDevsNFTBalanceOf } from "@/services/queries";

export const NFTBalance = () => {
  const { address } = useAccount();

  const chainId = useChainId() as typeof sepolia.id;

  const {  CryptoDevsNFTDao,CryptoDevsNFT } =
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

  const totalSupply = useSuspenseQuery(
    readContractQueryOptions(config,{
      abi:CryptoDevsNFT.abi,
      address:CryptoDevsNFT.address,
      functionName:'totalSupply'
    })
  )

  console.log(Number(totalSupply.data),'data')

  // Fetch the CryptoDevs NFT balance of the user
  const nftBalanceOfUser = useCryptoDevsNFTBalanceOf(address!)
  return (
    <div>
      <h1>Welcome to Crypto Devs!</h1>
      <div>Welcome to the DAO!</div>
      <div>
        Your CryptoDevs NFT Balance: {nftBalanceOfUser?.data?.toString()}
      <div>
        {Number(totalSupply.data)}/10 has been minted
        </div>
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
