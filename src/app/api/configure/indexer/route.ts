// app/api/configure/indexer
import {
  dockerComposeUpIndexer,
  dockerIsIndexerUp,
  prepareDB,
} from "@/services/indexer";
import { Config, NETWORKS, Network } from "@citizenwallet/sdk";
import { existsSync, readFileSync, unlinkSync } from "fs";

export interface ConfigureResponse {
  hash: string;
}

export async function POST(req: Request) {
  try {
    const indexerIsRunning = await dockerIsIndexerUp();
    if (indexerIsRunning) {
      return Response.json({ message: "Already running" }, { status: 400 });
    }

    if (!existsSync(process.cwd() + ".community/config/community.json")) {
      return Response.json(
        { message: "Community not configured" },
        { status: 412 }
      );
    }

    const community: Config = JSON.parse(
      readFileSync(process.cwd() + ".community/config/community.json", "utf8")
    );

    const network: Network = NETWORKS[community.node.chain_id];
    if (!community.erc4337.paymaster_address) {
      return Response.json(
        { message: "Paymaster address not provided" },
        { status: 412 }
      );
    }

    const pk = readFileSync(process.cwd() + ".community/config/pk", "utf8");
    if (!pk) {
      return Response.json(
        { message: "Private key not provided" },
        { status: 412 }
      );
    }

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
    unlinkSync(process.cwd() + ".community/config/pk");

    await Promise.race([
      dockerComposeUpIndexer(),
      new Promise<void>((resolve, _) => setTimeout(() => resolve(), 2000)),
    ]);

    return Response.json({} as ConfigureResponse, { status: 200 });
  } catch (error: any) {
    console.log("Error writing file", error);
    return Response.json(
      { message: "Error writing file", error: error.message },
      { status: 500 }
    );
  }
}
