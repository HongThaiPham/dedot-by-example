"use client";
import { createContext, PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DedotProvider from "./DedotProvider";
import HeaderBar from "./commons/HeaderBar";
const queryClient = new QueryClient();

const AppContext = createContext({
  rpcUrl: "",
  setRpcUrl: (url: string) => {},
});

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <DedotProvider>
        <HeaderBar />
        <main className="flex min-h-screen flex-col px-4 sm:px-6 lg:px-8 py-5 max-w-7xl mx-auto">
          {children}
        </main>
      </DedotProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
