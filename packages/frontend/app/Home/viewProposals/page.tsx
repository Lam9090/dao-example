"use client";
import { useContracts } from "@/services/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { useConfig, useReadContract, useWriteContract } from "wagmi";
import {
  readContractQueryOptions,
  readContractsQueryOptions,
} from "wagmi/query";
import styles from "./page.module.css";
import { waitForTransactionReceipt } from "wagmi/actions";

enum Vote {
  APPROVE,
  REjECT,
}
export default function ViewProposals() {
  const { CryptoDevsNFTDao } = useContracts();

  const config = useConfig();
  const proposalsNum = useSuspenseQuery(
    readContractQueryOptions(config, {
      address: CryptoDevsNFTDao.address,
      abi: CryptoDevsNFTDao.abi,
      functionName: "size",
    })
  );
  const { writeContractAsync } = useWriteContract();

  const createProposalsRead = (size: number) => {
    return Array.from({ length: size }, (_, index) => ({
      address: CryptoDevsNFTDao.address,
      abi: CryptoDevsNFTDao.abi,
      functionName: "proposals",
      args: [index],
    }));
  };
  const { data } = useSuspenseQuery({
    ...readContractsQueryOptions(config, {
      contracts:
        proposalsNum.data > 0
          ? createProposalsRead(Number(proposalsNum.data))
          : [],
    }),
  });
  const proposals = data.map((d, id) => {
    const [nftTokenId, deadline, approvals, rejections, executed,votes] =
      d.result as unknown as any[];
      console.log(votes,'votes',d.result)
    return {
      proposalId: id,
      nftTokenId: nftTokenId.toString(),
      deadline: new Date(parseInt(deadline.toString()) * 1000),
      approvals: approvals.toString(),
      rejections: rejections.toString(),
      executed: Boolean(executed),
    };
  });
  // Function to vote YAY or NAY on a proposal
  async function voteForProposal(proposalId: number, vote: Vote) {
    try {
      const tx = await writeContractAsync({
        address: CryptoDevsNFTDao.address,
        abi: CryptoDevsNFTDao.abi,
        functionName: "voteOnProposal",
        args: [BigInt(proposalId), vote === Vote.APPROVE ? 0 : 1],
      });

      await waitForTransactionReceipt(config, { hash: tx });
      window.alert("Success");
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
  }

  async function executeProposal(proposalId: number) {
    try {
      const tx = await writeContractAsync({
        address: CryptoDevsNFTDao.address,
        abi: CryptoDevsNFTDao.abi,
        functionName: "excuteProposal",
        args: [BigInt(proposalId)],
      });

      await waitForTransactionReceipt(config, { hash: tx });
      window.alert("Success");
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
  }

  if (proposals.length === 0) {
    return <div>No proposals have been created</div>;
  }

  return (
    <div>
      {proposals.map((p, index) => (
        <div key={index} className={styles.card}>
          <p>Proposal ID: {p.proposalId}</p>
          <p>Fake NFT to Purchase: {p.nftTokenId}</p>
          <p>Deadline: {p.deadline.toLocaleString()}</p>
          <p>Approval Votes: {p.approvals}</p>
          <p>Reject Votes: {p.rejections}</p>
          <p>Executed?: {p.executed.toString()}</p>
          {p.deadline.getTime() > Date.now() && !p.executed ? (
            <div className={styles.flex}>
              <button
                className={styles.button2}
                onClick={() => voteForProposal(p.proposalId, Vote.APPROVE)}
              >
                Approve
              </button>
              <button
                className={styles.button2}
                onClick={() => voteForProposal(p.proposalId, Vote.REjECT)}
              >
                Reject
              </button>
            </div>
          ) : p.deadline.getTime() < Date.now() && !p.executed ? (
            <div className={styles.flex}>
              <button
                className={styles.button2}
                onClick={() => executeProposal(p.proposalId)}
              >
                Execute Proposal{" "}
                {p.approvals > p.rejections ? "(Approve)" : "(Reject)"}
              </button>
            </div>
          ) : (
            <div className={styles.description}>Proposal Executed</div>
          )}
        </div>
      ))}
    </div>
  );
}
