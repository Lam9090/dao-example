"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { State, WagmiProvider } from "wagmi";
import { wagmiConfigWithWallets } from "@/services/web3/wagmiConfig";
import { queryClient } from "@/services/queryClient";
import { ReactNode } from "react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

type Props = {
  children: ReactNode;
  initialState?: State | undefined;
};

export default function Provider({ children, initialState }: Readonly<Props>) {
  return (
    <WagmiProvider config={wagmiConfigWithWallets} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
