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
        {children}
      </DedotProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
