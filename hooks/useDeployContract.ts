import { useDedotProvider } from "@/components/DedotProvider";
import { useMutation } from "@tanstack/react-query";
import { ISubstrateClient } from "dedot";
import { ContractDeployer, ContractMetadata } from "dedot/contracts";
import { stringToHex } from "dedot/utils";
import { toast } from "sonner";

const useDeployContract = () => {
  const { dedotClient, connectedAccounts, activeProvider } = useDedotProvider();
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

      return toast.promise(
        async () => {
          return new Promise(async (resolve, reject) => {
            try {
              const {
                raw: { gasRequired },
              } = await deployer.query[constructor]({
                caller: connectedAccounts[0].address,
                salt,
              });

              console.log({ gasRequired });

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
                    console.log("Contract address:", contractAddress);
                    resolve(contractAddress);
                  }
                }
              );
            } catch (error) {
              reject(error);
            }
          });
        },
        {
          loading: `Deploying contract ${metadata.contract.name} ...`,
          success: (address) => {
            return `Contract deployed at ${address}`;
          },
          error: `Failed to deploy contract`,
        }
      );
    },
  });
};

export default useDeployContract;
