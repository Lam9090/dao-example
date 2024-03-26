import { sepolia, hardhat } from "wagmi/chains";
import { http, createStorage, cookieStorage } from "wagmi";
import { getDefaultConfig, getDefaultWallets } from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
const { wallets } = getDefaultWallets();

export const wagmiConfigWithWallets = getDefaultConfig({
  chains: [hardhat, sepolia],
  ssr: true,
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  },
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "PROJECT_ID",
  appName: "Dao example",
});
