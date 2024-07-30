// Find network endpoints: https://github.com/polkadot-js/apps/tree/master/packages/apps-config/src/endpoints

export interface INetwork {
  logo?: string;
  name: string;
  endpoint: string;
  decimals: number;
}

export const POLKADOT: INetwork = {
  logo: "/assets/chains/logo/polkadot-circle.svg",
  name: "polkadot",
  endpoint: "wss://rpc.polkadot.io",
  decimals: 10,
};

export const ROCOCO: INetwork = {
  logo: "/assets/chains/logo/rococo.svg",
  name: "rococo",
  endpoint: "wss://rococo-rpc.polkadot.io",
  decimals: 12,
};

export const ROCOCO_CONTRACT: INetwork = {
  logo: "/assets/chains/logo/rococo.svg",
  name: "rococo-contracts",
  endpoint: "wss://rococo-contracts-rpc.polkadot.io",
  decimals: 12,
};

export const ROCOCO_ASSETHUB: INetwork = {
  logo: "/assets/chains/logo/rococo.svg",
  name: "rococo-assethub",
  endpoint: "wss://rococo-asset-hub-rpc.polkadot.io",
  decimals: 12,
};

export const WESTEND: INetwork = {
  name: "westend",
  endpoint: "wss://westend-rpc.dwellir.com",
  decimals: 12,
};

export const WESTEND_ASSETHUB: INetwork = {
  name: "westend-assethub",
  endpoint: "wss://westend-asset-hub-rpc.polkadot.io",
  decimals: 12,
};

export const WESTEND_PEOPLE: INetwork = {
  name: "westend-people",
  endpoint: "wss://westend-people-rpc.polkadot.io",
  decimals: 12,
};

export const SUPPORTED_NETWORKS = [
  POLKADOT,
  ROCOCO,
  ROCOCO_CONTRACT,
  ROCOCO_ASSETHUB,
  WESTEND,
  WESTEND_ASSETHUB,
  WESTEND_PEOPLE,
];
