// app/api/configure
import {
  communityFileExists,
  communityHashExists,
  configFolderExists,
  createConfigFolder,
  writeAppEnv,
  writeCommunityFile,
  writeCommunityHash,
  writeIndexerEnv,
} from "@/services/community";
import { pinJson } from "@/services/ipfs";
import { generateKey } from "@/utils/random";
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

    const ipfsBaseUrl = process.env.IPFS_BASE_URL;
    const ipfsApiKey = process.env.IPFS_API_KEY;
    const ipfsApiSecret = process.env.IPFS_API_SECRET;
    if (!ipfsBaseUrl || !ipfsApiKey || !ipfsApiSecret) {
      return Response.json({ message: "IPFS not configured" }, { status: 500 });
    }

    const webBurnerPassword = process.env.APP_WEB_BURNER_PASSWORD;
    const webDBVoucherPassword = process.env.APP_WEB_DB_VOUCHER_PASSWORD;
    const webSentryUrl = process.env.APP_WEB_SENTRY_URL;
    if (!webBurnerPassword || !webDBVoucherPassword || !webSentryUrl) {
      return Response.json({ message: "App not configured" }, { status: 500 });
    }

    config.node.url = network.rpcUrl;
    config.node.ws_url = network.wsRpcUrl;

    const dbSecret = generateKey(32);

    const hash = await pinJson(config); // pin the config to IPFS

    writeCommunityHash(hash);
    writeCommunityFile(config);

    writeIndexerEnv(
      network,
      ipfsBaseUrl,
      ipfsApiKey,
      ipfsApiSecret,
      btoa(dbSecret)
    );

    writeAppEnv(webBurnerPassword, webDBVoucherPassword, webSentryUrl);

    return Response.json({ hash } as ConfigureResponse, { status: 200 });
  } catch (error: any) {
    console.log("Error writing file", error);
    return Response.json(
      { message: "Error writing file", error: error.message },
      { status: 500 }
    );
  }
}
