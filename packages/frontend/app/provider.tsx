"use client";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { State, WagmiProvider } from "wagmi";
import { wagmiConfigWithWallets } from "@/services/web3/wagmiConfig";
import { queryClient } from "@/services/queryClient";
import { ReactNode } from "react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
type Props = {
  children: ReactNode;
  initialState?: State | undefined;
};

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/69792/dev/version/latest",
  cache: new InMemoryCache(),
});

export default function Provider({ children, initialState }: Readonly<Props>) {
  const router = useRouter();
  return (
    <WagmiProvider config={wagmiConfigWithWallets} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider navigate={router.push.bind(router)}>
          <ApolloProvider client={client}>
            <RainbowKitProvider>{children}</RainbowKitProvider>
          </ApolloProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
