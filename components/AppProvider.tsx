"use client";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DedotProvider from "./DedotProvider";
import HeaderBar from "./commons/HeaderBar";
import { Toaster } from "sonner";

import { WalletAggregator } from "@polkadot-onboard/core";
import { InjectedWalletProvider } from "@polkadot-onboard/injected-wallets";

import { PolkadotWalletsContextProvider } from "@polkadot-onboard/react";
import { APP_NAME } from "@/lib/constants";

const queryClient = new QueryClient();

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  let walletAggregator = new WalletAggregator([
    new InjectedWalletProvider({}, APP_NAME),
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
        <DedotProvider>
          <HeaderBar />
          <main className="flex min-h-screen flex-col px-4 sm:px-6 lg:px-8 py-5 max-w-7xl mx-auto">
            {children}
          </main>
        </DedotProvider>
      </PolkadotWalletsContextProvider>
      <Toaster />
    </QueryClientProvider>
  );
};

export default AppProvider;
