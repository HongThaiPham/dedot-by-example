"use client";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DedotClient, WsProvider } from "dedot";
import { toast } from "sonner";
import { INetwork, LOCAL_NODE, ROCOCO_CONTRACT } from "@/lib/networks";
import {
  InjectedWindow,
  InjectedWindowProvider,
  Injected,
} from "@polkadot/extension-inject/types";
import { APP_NAME } from "@/lib/constants";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Account, BaseWallet } from "@polkadot-onboard/core";
import { useWallets } from "@polkadot-onboard/react";

interface DedotContextState {
  dedotClient: DedotClient | undefined;
  network?: INetwork;
  setNetwork: (network: INetwork) => void;
  isConnected?: boolean;
  activeProvider?: BaseWallet;
  connect?: (w: BaseWallet) => void;
  disconnect?: () => void;
  connectedAccounts: Account[];
}

export const DedotContext = createContext<DedotContextState>({
  dedotClient: undefined,
  setNetwork: (network: INetwork | undefined) => {},
  connectedAccounts: [],
});

const DedotProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [selectedProvider, setSelectedProvider] = useLocalStorage(
    "PROVIDER",
    ""
  );
  const { wallets } = useWallets();
  const [network, setNetwork] = useLocalStorage<INetwork>(
    "NETWORK",
    LOCAL_NODE || ROCOCO_CONTRACT
  );

  const [dedotClient, setDedotClient] = useState<DedotClient | undefined>(
    undefined
  );

  const [connectedAccounts, setConnectedAccounts] = useState<Account[]>([]);

  const InitClient = useCallback(
    async (force: boolean = false) => {
      if (!network) return;
      if (!dedotClient || force) {
        toast.promise(
          () => {
            const wsProvider = new WsProvider(network.endpoint);
            return DedotClient.new({
              provider: wsProvider,
              cacheMetadata: true,
            });
          },
          {
            loading: `Connecting dedot to ${network.name.toUpperCase()} ...`,
            success: (client) => {
              setDedotClient(client);
              return `Connected to ${network.name.toUpperCase()}`;
            },
            error: `Failed to initialize dedot client`,
          }
        );
      }
    },
    [dedotClient, network]
  );

  const connect = async (w: BaseWallet) => {
    await w.connect();
    setSelectedProvider(w.metadata.id);
    const unsub = await w.subscribeAccounts((accounts) => {
      setConnectedAccounts(accounts);
    });

    return () => {
      return unsub();
    };
  };

  const disconnect = async () => {
    const w = wallets?.find((w) => w.metadata.id === selectedProvider);
    if (w) {
      await w.disconnect();
      setSelectedProvider("");
      setConnectedAccounts([]);
    }
  };

  const handleNetworkChange = useCallback(
    async (network: INetwork) => {
      setNetwork(network);
      if (dedotClient) await dedotClient?.disconnect();

      await InitClient(true);
      return () => {
        dedotClient?.disconnect;
      };
    },
    [InitClient, dedotClient, setNetwork]
  );

  const reconnect = async () => {
    if (selectedProvider != "") {
      if (!activeProvider) return;
      await connect(activeProvider);
    }
  };

  const isConnected = useMemo(() => {
    return connectedAccounts.length > 0;
  }, [connectedAccounts]);

  const activeProvider = useMemo(() => {
    return wallets?.find((w) => w.metadata.id === selectedProvider);
  }, [selectedProvider, wallets]);

  useEffect(() => {
    InitClient(true);
    reconnect();
    return () => {
      dedotClient?.disconnect;
    };
  }, [wallets]);

  return (
    <DedotContext.Provider
      value={{
        dedotClient,
        setNetwork: handleNetworkChange,
        network,
        isConnected,
        connect,
        disconnect,
        activeProvider,
        connectedAccounts,
      }}
    >
      {children}
    </DedotContext.Provider>
  );
};

export default DedotProvider;

export const useDedotProvider = () => useContext(DedotContext);
