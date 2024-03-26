"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount, useChainId, useConfig, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import deployedContracts from "@/contracts/deployedContracts";
import { sepolia } from "viem/chains";
import { wagmiConfigWithWallets } from "@/services/web3/wagmiConfig";
import { readContractQueryOptions } from "wagmi/query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function RootPage() {
  // Check if the user's wallet is connected, and it's address using Wagmi's hooks.
  const { isConnected } = useAccount();

  // State variable to know if the component has been mounted yet or not
  const [isMounted, setIsMounted] = useState(false);

  // Fetch the owner of the DAO

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!isConnected) {
    return (
      <div>
        b
        <ConnectButton />
      </div>
    );
  }

  router.replace("/Home");
}
