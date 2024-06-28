import { StoreApi, UseBoundStore } from "zustand";
import { ServerState, useServerStore } from "./state";
import { useMemo } from "react";
import { delay } from "@/utils/delay";

export class ServerActions {
  baseUrl: string =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_PATH || ""
      : "";
  state: ServerState;
  constructor(state: ServerState) {
    this.state = state;
  }

  async update() {
    try {
      this.state.startUpdate();

      if (process.env.NODE_ENV !== "production") {
        throw new Error("No update in development mode");
      }

      // when this resolves, the script should be done
      await fetch(`${this.baseUrl}/api/server`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await delay(5000);

      // reload the page
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
    this.state.finishUpdate();
  }
}

export const useServer = (): [
  UseBoundStore<StoreApi<ServerState>>,
  ServerActions
] => {
  const serverStore = useServerStore;

  const actions = useMemo(
    () => new ServerActions(serverStore.getState()),
    [serverStore]
  );

  return [serverStore, actions];
};
