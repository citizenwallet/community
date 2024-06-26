import {
  Config,
  ConfigScan,
  ConfigNode,
  ConfigCommunity,
  ConfigToken,
  Network,
} from "@citizenwallet/sdk";
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
  setPrimaryColor: (color: string) => void;
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
  deployment: {
    step: DeployStep;
    loading: boolean;
    error: boolean;
  };
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
  config: undefined,
  loading: true,
  error: false,
  invalidUrl: false,
  deployment: {
    step: DeployStep.Config,
    loading: false,
    error: false,
  },
});

export const useConfigStore = create<ConfigStore>((set) => ({
  ...getInitialState(),
  setPrimaryColor: (primaryColor) => set({ primaryColor }),
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
}));
