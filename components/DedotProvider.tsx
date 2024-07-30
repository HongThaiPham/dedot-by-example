import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DedotClient, WsProvider } from "dedot";
import { toast } from "sonner";
import { INetwork, ROCOCO_CONTRACT } from "@/lib/networks";
interface DedotContextState {
  dedotClient: DedotClient | undefined;
  network?: INetwork;
  setNetwork: (network: INetwork) => void;
}

export const DedotContext = createContext<DedotContextState>({
  dedotClient: undefined,
  network: ROCOCO_CONTRACT,
  setNetwork: (network: INetwork | undefined) => {},
});

const DedotProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [network, setNetwork] = useState<INetwork>(ROCOCO_CONTRACT);
  const [dedotClient, setDedotClient] = useState<DedotClient | undefined>(
    undefined
  );

  const InitClient = useCallback(async () => {
    if (!dedotClient) {
      const wsProvider = new WsProvider(network.endpoint);
      const client = await DedotClient.new(wsProvider);
      setDedotClient(client);
    }
  }, [dedotClient, network]);

  useEffect(() => {
    toast.promise(InitClient(), {
      loading: "Initializing dedot client...",
      success: "Initialized dedot client successfully",
      error: "Failed to initialize dedot client",
    });
    return () => {
      dedotClient?.disconnect;
    };
  }, [InitClient, dedotClient]);

  return (
    <DedotContext.Provider value={{ dedotClient, setNetwork, network }}>
      {children}
    </DedotContext.Provider>
  );
};

export default DedotProvider;

export const useDedotProvider = () => useContext(DedotContext);
