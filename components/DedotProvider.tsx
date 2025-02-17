"use client";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DedotClient, LegacyClient, WsProvider } from "dedot";
import { toast } from "sonner";
import { INetwork, POLKADOT } from "@/lib/networks";
import { useLocalStorage } from "usehooks-ts";

interface DedotContextState {
  dedotClient: DedotClient | LegacyClient | undefined;
}

export const DedotContext = createContext<DedotContextState>({
  dedotClient: undefined,
});

const DedotProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [network] = useLocalStorage<INetwork>("NETWORK", POLKADOT);

  const [dedotClient, setDedotClient] = useState<
    DedotClient | LegacyClient | undefined
  >(undefined);
  const InitClient = useCallback(async () => {
    console.log(network);
    if (!network) return;
    if (dedotClient) await dedotClient?.disconnect();

    toast.dismiss();
    toast.promise(
      () => {
        const wsProvider = new WsProvider(network.endpoint);
        if (network.isLegacy) {
          return LegacyClient.new({
            provider: wsProvider,
            cacheMetadata: true,
          });
        } else {
          return DedotClient.new({
            provider: wsProvider,
            cacheMetadata: true,
          });
        }
      },
      {
        loading: `Connecting dedot to ${network.name.toUpperCase()} ...`,
        success: (client: LegacyClient | DedotClient) => {
          setDedotClient(client);
          return `Connected to ${network.name.toUpperCase()}`;
        },
        error: `Failed to initialize dedot client`,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network?.endpoint]);

  useEffect(() => {
    InitClient();
  }, [InitClient]);

  return (
    <DedotContext.Provider
      value={{
        dedotClient,
      }}
    >
      {children}
    </DedotContext.Provider>
  );
};

export default DedotProvider;

export const useDedotProvider = () => useContext(DedotContext);
