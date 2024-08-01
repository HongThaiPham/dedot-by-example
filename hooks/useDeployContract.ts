import { useDedotProvider } from "@/components/DedotProvider";
import { useWalletProvider } from "@/components/WalletProvider";
import { useMutation } from "@tanstack/react-query";
import { ISubstrateClient } from "dedot";
import { ContractDeployer, ContractMetadata } from "dedot/contracts";
import { stringToHex } from "dedot/utils";
import { toast } from "sonner";

const useDeployContract = () => {
  const { dedotClient } = useDedotProvider();
  const { connectedAccounts, activeProvider } = useWalletProvider();
  return useMutation({
    mutationKey: ["deploy-contract"],
    mutationFn: async ({
      metadata,
      constructor,
      wasm,
    }: {
      metadata: ContractMetadata;
      constructor: string;
      wasm?: string;
    }) => {
      if (!dedotClient || !activeProvider) return;
      const _wasm = metadata.source.wasm || wasm;

      const deployer = new ContractDeployer(
        dedotClient as ISubstrateClient,
        metadata,
        _wasm!
      );
      const timestamp = await dedotClient.query.timestamp.now();
      const salt = stringToHex(`${dedotClient.rpcVersion}_${timestamp}`);
      let tid = "deploy-contract";
      const result = await new Promise(async (resolve, reject) => {
        try {
          toast.loading("Calculating gas required ...", { id: tid });
          const {
            raw: { gasRequired },
          } = await deployer.query.default({
            caller: connectedAccounts[0].address,
            salt,
          });

          console.log({ gasRequired });

          toast.loading("Deploying contract ...", {
            id: tid,
          });

          await deployer.tx[constructor]({
            gasLimit: gasRequired,
            salt,
          }).signAndSend(
            connectedAccounts[0].address,
            {
              signer: activeProvider.signer,
            },
            async ({ status, events }: { status: any; events: any[] }) => {
              console.log(
                `[${dedotClient.rpcVersion}] Transaction status:`,
                status.type
              );

              if (status.type === "Finalized") {
                const instantiatedEvent = events
                  .map(({ event }) => event) // prettier-end-here
                  .find(dedotClient.events.contracts.Instantiated.is); // narrow down the type for type suggestions

                console.log(
                  instantiatedEvent,
                  "Event Contracts.Instantiated should be available"
                );

                const contractAddress =
                  instantiatedEvent?.palletEvent.data.contract.address();
                toast.success("Contract deployed successfully!", {
                  id: tid,
                });
                resolve(contractAddress);
              }
            }
          );
        } catch (error) {
          console.error(error);
          toast.error("Failed to deploy contract", { id: tid });
          reject(error);
        }
      });
      return result;
    },
  });
};

export default useDeployContract;
