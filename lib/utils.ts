import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { decodeAddress } from "dedot/utils";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format on=chain balance
 *
 * @param balance
 * @param decimal
 */
export const formatBalance = (
  balance: bigint,
  decimal: number = 12
): string => {
  return (parseFloat(balance.toString()) / Math.pow(10, decimal)).toString();
};

/**
 * Validate a Polkadot address
 *
 * @param addressToCheck
 */
export const validateAddress = (addressToCheck: string) => {
  try {
    return !!decodeAddress(addressToCheck);
  } catch (e) {
    return false;
  }
};

export const truncateHash = (
  hash: string | undefined,
  paddingLength = 6
): string | undefined => {
  if (!hash?.length) return undefined;
  if (hash.length <= paddingLength * 2 + 1) return hash;
  return hash.replace(
    hash.substring(paddingLength, hash.length - paddingLength),
    "…"
  );
};
