`use client`;
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Provider from "./provider";
import Head from "next/head";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className +" h-screen dark text-foreground bg-background"}>
        <Head>
          <title>Dao Example</title>
        </Head>
        <Provider>
          <NavBar></NavBar>
          {children}</Provider>
      </body>
    </html>
  );
}
