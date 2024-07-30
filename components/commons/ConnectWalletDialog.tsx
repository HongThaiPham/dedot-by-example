"use client";
import { Button } from "../ui/button";
import { useDedotProvider } from "../DedotProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Wallet } from "lucide-react";
import { useWallets } from "@polkadot-onboard/react";

const ConnectWalletDialog = () => {
  const { wallets } = useWallets();
  const { connect } = useDedotProvider();

  return (
    <Dialog>
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
              onClick={() => connect?.(w)}
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
