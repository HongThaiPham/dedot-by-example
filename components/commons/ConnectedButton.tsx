"use client";
import { CircleUser } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DisplayAddress from "./DisplayAddress";

import { useWalletProvider } from "../WalletProvider";
import { toast } from "sonner";

const ConnectedButton = () => {
  const { connectedAccounts, disconnect, isConnected } = useWalletProvider();

  if (!isConnected) return null;

  const handleDisconnectWallet = () => {
    if (disconnect) disconnect();
  };

  const handleCopyAddress = () => {
    if (connectedAccounts && connectedAccounts.length > 0) {
      navigator.clipboard.writeText(connectedAccounts[0].address);
      toast.success("Address copied to clipboard");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full" variant={"secondary"}>
          <CircleUser className="mr-2" />
          <DisplayAddress
            address={connectedAccounts?.[0]?.address}
            paddingLength={4}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleCopyAddress}
          className="cursor-pointer"
        >
          Copy address
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDisconnectWallet}
          className="cursor-pointer"
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConnectedButton;
