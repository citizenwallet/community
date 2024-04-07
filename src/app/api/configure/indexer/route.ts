// app/api/configure/indexer
import { communityFileExists, readCommunityFile } from "@/services/community";
import {
  downloadIndexer,
  isIndexerRunning,
  prepareDB,
  startIndexer,
} from "@/services/indexer";
import { NETWORKS, Network } from "@citizenwallet/sdk";
import { readFileSync, unlinkSync } from "fs";

export interface ConfigureResponse {
  hash: string;
}

export async function POST(req: Request) {
  try {
    const indexerIsRunning = isIndexerRunning();
    if (indexerIsRunning) {
      return Response.json({ message: "Already running" }, { status: 400 });
    }

    if (!communityFileExists()) {
      return Response.json(
        { message: "Community not configured" },
        { status: 412 }
      );
    }

    const community = readCommunityFile();
    if (!community) {
      return Response.json(
        { message: "Community not configured" },
        { status: 412 }
      );
    }

    const network: Network = NETWORKS[community.node.chain_id];
    if (!community.erc4337.paymaster_address) {
      return Response.json(
        { message: "Paymaster address not provided" },
        { status: 412 }
      );
    }

    const pk = readFileSync(process.cwd() + "/.community/config/pk", "utf8");
    if (!pk) {
      return Response.json(
        { message: "Private key not provided" },
        { status: 412 }
      );
    }

    downloadIndexer();

    await prepareDB(
      network,
      community.token.decimals,
      community.token.address,
      community.token.name,
      community.token.symbol,
      community.erc4337.paymaster_address,
      pk
    );

    // remove the file
    unlinkSync(process.cwd() + "/.community/config/pk");

    // check if indexer is running
    startIndexer(network.chainId);

    return Response.json({} as ConfigureResponse, { status: 200 });
  } catch (error: any) {
    console.log("Error writing file", error);
    return Response.json(
      { message: "Error writing file", error: error.message },
      { status: 500 }
    );
  }
}
