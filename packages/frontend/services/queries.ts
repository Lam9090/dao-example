import { readContractQueryOptions } from "wagmi/query";
import { wagmiConfigWithWallets } from "./web3/wagmiConfig";
import { useChainId, useConfig } from "wagmi";
import deployedContracts from "@/contracts/deployedContracts";
import { Address } from "abitype";
import { useSuspenseQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";

export const useContracts = <T extends keyof typeof deployedContracts>() => {
  const chainId = useChainId<typeof wagmiConfigWithWallets>();
  return deployedContracts[chainId as any as T];
};

export const useContract = <T extends keyof ReturnType<typeof useContracts>>(contractName: T) => {
  const contracts = useContracts();

  return contracts[contractName];
};

export const useCryptoDevsNFTBalanceOf = (address: Address) => {
  const config = useConfig();

  const { CryptoDevsNFT } = useContracts();
  return useSuspenseQuery(
    readContractQueryOptions(config, {
      abi: CryptoDevsNFT.abi,
      address: CryptoDevsNFT.address,
      functionName: "balanceOf",
      args: [address],
    })
  );
};


