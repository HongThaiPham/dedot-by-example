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
import { INetwork, ROCOCO_CONTRACT } from "@/lib/networks";
import {
  InjectedWindow,
  InjectedWindowProvider,
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
  activeProvider?: InjectedWindowProvider;
  connect?: (w: BaseWallet) => void;
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
  const [network, setNetwork] = useState<INetwork>(ROCOCO_CONTRACT);

  const [dedotClient, setDedotClient] = useState<DedotClient | undefined>(
    undefined
  );
  const [activeProvider, setActiveProvider] = useState<
    InjectedWindowProvider | undefined
  >(undefined);

  const [connectedAccounts, setConnectedAccounts] = useState<Account[]>([]);

  const InitClient = useCallback(
    async (force: boolean = false) => {
      if (!network) return;
      if (!dedotClient || force) {
        toast.promise(
          () => {
            const wsProvider = new WsProvider(network.endpoint);
            return DedotClient.new(wsProvider);
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
    [network]
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

  const handleNetworkChange = useCallback(async (network: INetwork) => {
    await dedotClient?.disconnect();
    setNetwork(network);
    await InitClient(true);
    return () => {
      dedotClient?.disconnect;
    };
  }, []);

  const reconnect = async () => {
    if (selectedProvider != "") {
      const wallet = wallets?.find((w) => w.metadata.id === selectedProvider);
      if (!wallet) return;
      await connect(wallet);
    }
  };

  const isConnected = useMemo(() => {
    return connectedAccounts.length > 0;
  }, [connectedAccounts]);

  useEffect(() => {
    InitClient();
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
