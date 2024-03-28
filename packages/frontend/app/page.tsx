"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
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
        <ConnectButton />
      </div>
    );
  }

  router.replace("/Home");
}
