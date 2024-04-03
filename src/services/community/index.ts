import { Config } from "@citizenwallet/sdk";
import { execSync } from "child_process";
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

export const downloadApp = async () => {
  // clean up the web folder
  execSync(`rm -rf ${process.cwd()}/.community/web/*`);

  // download version file
  const buildVersionFileName = process.env.BUILD_VERSION_FILE_NAME;
  const buildOutputUrl = process.env.BUILD_OUTPUT_URL;
  execSync(
    `curl -H 'Cache-Control: no-cache' -o ${process.cwd()}/.community/${buildVersionFileName}-web -L ${buildOutputUrl}/web/${buildVersionFileName}?cache_buster=$(date +%s) > /dev/null 2>&1`
  );

  const buildVersion = readFileSync(
    `${process.cwd()}/.community/${buildVersionFileName}-web`,
    "utf8"
  ).replace(/\r?\n|\r/g, "");

  // download the app
  execSync(
    `curl -o ${process.cwd()}/.community/app.tar.gz -L ${buildOutputUrl}/web/cw_web_${buildVersion}.tar.gz > /dev/null 2>&1`
  );

  // extract the app
  execSync(
    `tar -xvf ${process.cwd()}/.community/app.tar.gz -C .community/web > /dev/null 2>&1`
  );

  // remove the tar
  execSync(`rm -rf ${process.cwd()}/.community/app.tar.gz > /dev/null 2>&1`);
};

export const isAppCompiled = async () => {
  const filePath = path.join(process.cwd(), ".community/web/index.html");
  return existsSync(filePath);
};
