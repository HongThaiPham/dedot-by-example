"use client";
import React from "react";
import { truncateHash } from "@/lib/utils";
import { encodeAddress } from "dedot/utils";
import { useDedotProvider } from "../DedotProvider";

type Props = {
  address: string | undefined;
  paddingLength?: number;
};

const DisplayAddress: React.FC<Props> = ({ address, paddingLength = 8 }) => {
  const { network } = useDedotProvider();
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
