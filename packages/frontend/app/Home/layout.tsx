"use client"
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
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { address,isConnected } = useAccount();
  const chainId = useChainId() as typeof sepolia.id;

  const { CryptoDevsNFTDao } = deployedContracts[chainId];

  // State variable to show loading state when waiting for a transaction to go through
  const [loading, setLoading] = useState(false);

  const { writeContractAsync } = useWriteContract();
  // Fetch the owner of the DAO

  const config = useConfig();
  const router = useRouter()

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

  if (!isConnected){
    router.replace('/');
    return;
  }

  return (
    <div>
      
      <Head>
        <title>CryptoDevs DAO</title>
        <meta name="description" content="CryptoDevs DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="fixed">
        <ConnectButton></ConnectButton>
      </div>

      <div className={styles.main}>
        <div>
          <NFTBalance></NFTBalance>
          <div className={styles.flex}>
            <Link key={"create Proposal"} href={"/Home/createProposal"}>
              <button className={styles.button}>Create Proposal</button>
            </Link>
            <Link key={"create Proposal"} href={"/Home/viewProposals"}>
              <button className={styles.button}>View Proposals</button>
            </Link>
          </div>
          {children}
          {/* Display additional withdraw button if connected wallet is owner */}
          {address &&
          address.toLowerCase() === daoOwner?.data?.toLowerCase() ? (
            <div>
              {loading ? (
                <button className={styles.button}>Loading...</button>
              ) : (
                <button className={styles.button} onClick={withdrawDAOEther}>
                  Withdraw DAO ETH
                </button>
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
