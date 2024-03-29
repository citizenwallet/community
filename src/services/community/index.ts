import { Config, Network } from "@citizenwallet/sdk";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

export const appFolderExists = (): boolean => {
  const folderPath = path.join(process.cwd(), ".community/web");
  return existsSync(folderPath);
};

export const createAppFolder = () => {
  const folderPath = path.join(process.cwd(), ".community/web");
  return mkdirSync(folderPath, { recursive: true });
};

export const configFolderExists = (): boolean => {
  const folderPath = path.join(process.cwd(), ".community/config");
  return existsSync(folderPath);
};

export const createConfigFolder = () => {
  const folderPath = path.join(process.cwd(), ".community/config");
  return mkdirSync(folderPath, { recursive: true });
};

export const readCommunityFile = (): Config | undefined => {
  if (!communityFileExists()) {
    return undefined;
  }

  // read community.json file
  const filePath = path.join(process.cwd(), ".community/config/community.json");
  const fileContents = readFileSync(filePath, "utf8");
  const config = JSON.parse(fileContents) as Config;
  return config;
};

export const communityFileExists = (): boolean => {
  const filePath = path.join(process.cwd(), ".community/config/community.json");
  return existsSync(filePath);
};

export const communityHashExists = (): boolean => {
  const filePath = path.join(process.cwd(), ".community/config/hash");
  return existsSync(filePath);
};

export const writeCommunityFile = (config: Config) => {
  const filePath = path.join(process.cwd(), ".community/config/community.json");
  const fileContents = JSON.stringify(config, null, 2);
  return writeFileSync(filePath, fileContents);
};

export const writeCommunityHash = (hash: string) => {
  const filePath = path.join(process.cwd(), ".community/config/hash");
  return writeFileSync(filePath, hash);
};

export const readCommunityHash = (): string | undefined => {
  const filePath = path.join(process.cwd(), ".community/config/hash");
  if (!existsSync(filePath)) {
    return undefined;
  }

  return readFileSync(filePath, "utf8");
};

export const writeIndexerEnv = (
  network: Network,
  ipfsBaseUrl: string,
  ipfsApiKey: string,
  ipfsApiSecret: string,
  dbSecret: string
) => {
  const env = `
    # CHAIN
    RPC_URL='${network.rpcUrl}'
    RPC_WS_URL='${network.wsRpcUrl}'

    # DEVOPS
    SENTRY_URL='x'
    DISCORD_URL='x'

    # IPFS
    PINATA_BASE_URL='${ipfsBaseUrl}'
    PINATA_API_KEY='${ipfsApiKey}'
    PINATA_API_SECRET='${ipfsApiSecret}'

    # DB
    DB_SECRET='${dbSecret}'
    `;

  const filePath = path.join(process.cwd(), ".env.indexer");
  return writeFileSync(filePath, env);
};

export const writeAppEnv = (
  webBurnerPassword: string,
  webDBVoucherPassword: string,
  webSentryUrl: string
) => {
  const env = `
    KNOWN_ADDRESS_BANK='0x0000000000000000000000000000000000000000'
    WEB_BURNER_PASSWORD='${webBurnerPassword}'
    WEB_LEGACY_ACCOUNT_FACTORY='0x9406Cc6185a346906296840746125a0E44976454'
    DB_VOUCHER_PASSWORD='${webDBVoucherPassword}'
    ORIGIN_HEADER='https://app.citizenwallet.xyz'
    MAIN_APP_SCHEME='citizenwallet://app.citizenwallet.xyz'
    APP_LINK_SUFFIX='.citizenwallet.xyz'
    SENTRY_URL='${webSentryUrl}'
    `;

  const filePath = path.join(process.cwd(), ".env.indexer");
  return writeFileSync(filePath, env);
};
