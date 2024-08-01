"use client";
import React from "react";
import { truncateHash } from "@/lib/utils";
import { encodeAddress } from "dedot/utils";
import { INetwork, POLKADOT } from "@/lib/networks";
import { useLocalStorage } from "usehooks-ts";

type Props = {
  address: string | undefined;
  paddingLength?: number;
};

const DisplayAddress: React.FC<Props> = ({ address, paddingLength = 8 }) => {
  const [network] = useLocalStorage<INetwork>("NETWORK", POLKADOT);
  if (!address) return null;
  return (
    <span>
      {truncateHash(
        encodeAddress(address, network?.prefix || 42),
        paddingLength
      )}
    </span>
  );
};

export default DisplayAddress;
