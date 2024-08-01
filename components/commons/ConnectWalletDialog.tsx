"use client";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Wallet } from "lucide-react";
import { useWallets } from "@polkadot-onboard/react";
import { useState } from "react";
import { useWalletProvider } from "../WalletProvider";

const ConnectWalletDialog = () => {
  const [open, setOpen] = useState(false);
  const { wallets } = useWallets();

  const { connect, isConnected } = useWalletProvider();

  if (isConnected) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Connect Wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="flex items-center gap-3">
          <Wallet />
          Select provider to connect
        </DialogTitle>
        <DialogDescription></DialogDescription>
        {wallets &&
          wallets.map((w) => (
            <Button
              onClick={() => {
                connect?.(w);
                setOpen(false);
              }}
              key={w.metadata.id}
              variant={"outline"}
            >
              {w.metadata.title.toUpperCase()}
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWalletDialog;
