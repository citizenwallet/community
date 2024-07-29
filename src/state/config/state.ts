import {
  Config,
  ConfigScan,
  ConfigNode,
  ConfigCommunity,
  ConfigToken,
  Network,
  Transfer,
} from "@citizenwallet/sdk";
import { IndexerResponsePaginationMetadata } from "@citizenwallet/sdk/dist/src/services/indexer";
import { create } from "zustand";

export enum ConfigStep {
  Start = "start",
  Chain = "chain",
  Community = "community",
  Checkout = "checkout",
  Deploy = "deploy",
}

export enum DeployStep {
  Config = "config",
  App = "app",
  Indexer = "indexer",
  Success = "success",
  Failed = "failed",
}

export type ConfigStore = {
  step: ConfigStep;
  primaryColor: string;
  secondaryColor: string;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  config?: Config;
  network?: Network;
  scan?: ConfigScan;
  node?: ConfigNode;
  community?: ConfigCommunity;
  token?: ConfigToken;
  loading: boolean;
  error: boolean;
  invalidUrl: boolean;
  setInvalidUrl: (invalidUrl: boolean) => void;
  setStep: (step: ConfigStep) => void;
  request: () => void;
  getStarted: () => void;
  chainContinue: (network: Network, scan: ConfigScan, node: ConfigNode) => void;
  communityContinue: (community: ConfigCommunity, token: ConfigToken) => void;
  transfers: Transfer[];
  transfersLoading: boolean;
  transfersMeta: IndexerResponsePaginationMetadata;
  deployment: {
    step: DeployStep;
    loading: boolean;
    error: boolean;
  };
  setTransfers: (transfers: Transfer[]) => void;
  setTransfersLoading: (loading: boolean) => void;
  setTransfersMeta: (transfersMeta: IndexerResponsePaginationMetadata) => void;
  deployRequest: (step: DeployStep) => void;
  deploySuccess: () => void;
  deployFailed: () => void;
  failed: () => void;
  reset: () => void;
};

const getInitialState = () => ({
  step: ConfigStep.Chain,
  primaryColor:
    process.env.NEXT_PUBLIC_COMMUNITY_THEME_PRIMARY_COLOR || "#000000",
  secondaryColor:
    process.env.NEXT_PUBLIC_COMMUNITY_THEME_SECONDARY_COLOR || "#000000",
  config: undefined,
  loading: true,
  error: false,
  invalidUrl: false,
  deployment: {
    step: DeployStep.Config,
    loading: false,
    error: false,
  },
  transfers: [],
  transfersLoading: true,
  transfersMeta: {
    limit: 10,
    offset: 0,
    total: 10,
  },
});

export const useConfigStore = create<ConfigStore>((set) => ({
  ...getInitialState(),
  setPrimaryColor: (primaryColor) => set({ primaryColor }),
  setSecondaryColor: (secondaryColor) => set({ secondaryColor }),
  setInvalidUrl: (invalidUrl) => set({ invalidUrl }),
  setStep: (step) => set({ step }),
  request: () => set({ loading: true, error: false }),
  getStarted: () => set({ step: ConfigStep.Chain }),
  chainContinue: (network, scan, node) =>
    set({ step: ConfigStep.Community, network, scan, node }),
  communityContinue: (community, token) =>
    set({ step: ConfigStep.Checkout, community, token }),
  deployRequest: (step: DeployStep) =>
    set({
      deployment: { step, loading: true, error: false },
    }),
  deploySuccess: () =>
    set({
      deployment: { step: DeployStep.Success, loading: false, error: false },
    }),
  deployFailed: () =>
    set({
      deployment: { step: DeployStep.Failed, loading: false, error: true },
    }),
  failed: () => set({ loading: false, error: true }),
  reset: () => set(getInitialState(), true),
  setTransfers: (transfers: Transfer[]) => set({ transfers: transfers }),
  setTransfersLoading: (loading: boolean) => set({ transfersLoading: loading }),
  setTransfersMeta: (transfersMeta: IndexerResponsePaginationMetadata) =>
    set({ transfersMeta }),
}));
