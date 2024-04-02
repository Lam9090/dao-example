"use client";
import React from "react";
import { useState } from "react";
import { useAccount, useChainId, useConfig, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import deployedContracts from "@/contracts/deployedContracts";
import { sepolia } from "viem/chains";
import { wagmiConfigWithWallets } from "@/services/web3/wagmiConfig";
import { readContractQueryOptions } from "wagmi/query";
import { useSuspenseQuery } from "@tanstack/react-query";
import styles from "./home.module.css";
import Head from "next/head";
import { NFTBalance } from "@/components/Balance";
import { useRouter } from "next/navigation";
import AutoBreadCrums from "@/components/AutoBreadcrums";
import { Button, Spacer } from "@nextui-org/react";
import Link from "next/link";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId() as typeof sepolia.id;

  const { CryptoDevsNFTDao } = deployedContracts[chainId];

  // State variable to show loading state when waiting for a transaction to go through
  const [loading, setLoading] = useState(false);

  const { writeContractAsync } = useWriteContract();
  // Fetch the owner of the DAO

  const config = useConfig();
  const router = useRouter();

  const daoOwner = useSuspenseQuery(
    readContractQueryOptions(config, {
      abi: CryptoDevsNFTDao.abi,
      address: CryptoDevsNFTDao.address,
      functionName: "owner",
    })
  );

  async function withdrawDAOEther() {
    setLoading(true);
    try {
      const tx = await writeContractAsync({
        address: CryptoDevsNFTDao.address,
        abi: CryptoDevsNFTDao.abi,
        functionName: "withdrawEther",
        args: [],
      });

      await waitForTransactionReceipt(wagmiConfigWithWallets, { hash: tx });
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
    setLoading(false);
  }

  if (!isConnected) {
    router.replace("/");
    return;
  }

  return (
    <div>
      <Head>
        <title>CryptoDevs DAO</title>
        <meta name="description" content="CryptoDevs DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-center items-center flex-col">
        <AutoBreadCrums></AutoBreadCrums>
        <Spacer y={4}></Spacer>
        <div className="flex flex-col justify-center items-center">
          <NFTBalance></NFTBalance>
        <Spacer y={4}></Spacer>
          <div className={styles.flex}>
            <Link  href={"/Home/createProposal"}>
              <Button>Create Proposal</Button>
            </Link>
            <Link  href={"/Home/viewProposals"}>
              <Button>View Proposals</Button>
            </Link>
          </div>
          {children}
          {address &&
          address.toLowerCase() === daoOwner?.data?.toLowerCase() ? (
            <div>
        <Spacer y={4}></Spacer>
              {loading ? (
                <Button type="button">Loading...</Button>
              ) : (
                <Button color="primary" onClick={withdrawDAOEther}>
                  Withdraw DAO ETH
                </Button>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
