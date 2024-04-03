// app/api/configure
import {
  communityFileExists,
  communityHashExists,
  configFolderExists,
  createConfigFolder,
  writeCommunityFile,
  writeCommunityHash,
} from "@/services/community";
import { completeIndexerEnv } from "@/services/indexer";
import { pinJson } from "@/services/ipfs";
import { Config, NETWORKS, Network } from "@citizenwallet/sdk";

export interface ConfigureResponse {
  hash: string;
}

export async function POST(req: Request) {
  try {
    const config: Config = await req.json(); // assuming the config is sent in the request body

    if (communityFileExists() && communityHashExists()) {
      return Response.json({ message: "File already exists" }, { status: 400 });
    }

    if (!configFolderExists()) {
      createConfigFolder();
    }

    const network: Network | undefined = NETWORKS[config.node.chain_id];
    if (!network) {
      return Response.json(
        { message: "Network not supported", chain_id: config.node.chain_id },
        { status: 400 }
      );
    }

    config.node.url = network.rpcUrl;
    config.node.ws_url = network.wsRpcUrl;

    const hash = await pinJson(config); // pin the config to IPFS

    writeCommunityHash(hash);
    writeCommunityFile(config);

    completeIndexerEnv(network);

    return Response.json({ hash } as ConfigureResponse, { status: 200 });
  } catch (error: any) {
    console.log("Error writing file", error);
    return Response.json(
      { message: "Error writing file", error: error.message },
      { status: 500 }
    );
  }
}
