"use client";

import { INetwork, SUPPORTED_NETWORKS } from "@/lib/networks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Image from "next/image";
import { useDedotProvider } from "../DedotProvider";

const NetworkSelect = () => {
  const { setNetwork } = useDedotProvider();
  const handleNetworkChange = (networkName: string) => {
    const network = SUPPORTED_NETWORKS.find((n) => n.name === networkName);
    if (network) {
      setNetwork(network);
    }
  };
  return (
    <Select onValueChange={handleNetworkChange}>
      <SelectTrigger className="w-[230px] outline-none">
        <SelectValue placeholder="Network" />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_NETWORKS.map((network) => (
          <SelectItem key={network.name} value={network.name}>
            <div className="flex items-center gap-2">
              {network.logo ? (
                <Image src={network.logo} alt="logo" width={24} height={24} />
              ) : null}
              <span className="text-xs">{network.name.toUpperCase()}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default NetworkSelect;
