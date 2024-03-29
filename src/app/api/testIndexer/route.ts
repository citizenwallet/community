// app/api/configure.ts
import {
  communityFileExists,
  writeAppEnv,
  writeCommunityFile,
  writeCommunityHash,
  writeIndexerEnv,
} from "@/services/community";
import { dockerComposeUpIndexer } from "@/services/cw";
import { pinJson } from "@/services/ipfs";
import { generateKey } from "@/utils/random";
import { Config, NETWORKS, Network } from "@citizenwallet/sdk";

export interface ConfigureResponse {
  hash: string;
}

export async function POST(req: Request) {
  try {
    await dockerComposeUpIndexer();

    return Response.json({} as ConfigureResponse, { status: 200 });
  } catch (error: any) {
    console.log("Error writing file", error);
    return Response.json(
      { message: "Error writing file", error: error.message },
      { status: 500 }
    );
  }
}
