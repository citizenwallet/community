import { Config } from "@citizenwallet/sdk";
import { execSync } from "child_process";
import { JsonRpcProvider, ethers } from "ethers";
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

export async function getSponsorAddress(
  paymasterContractAddress: string,
  provider: JsonRpcProvider
) {
  const abi = ["function sponsor() public view returns (address)"];

  const contract = new ethers.Contract(paymasterContractAddress, abi, provider);

  const sponsorAddress = await contract.sponsor();

  return sponsorAddress;
}

export const getDashboardVersion = async (): Promise<string> => {
  try {
    const buildVersionFileName = process.env.BUILD_VERSION_FILE_NAME;
    const buildOutputUrl = process.env.BUILD_OUTPUT_URL;

    const timestamp = (new Date().getTime() / 1000 / 60).toFixed(0);
    const url = `${buildOutputUrl}/community/${buildVersionFileName}?cache_buster=${timestamp}`;

    const response = await fetch(url);

    const version = await response.text();

    return version;
  } catch (error) {}

  return "0.0.0";
};

export const updateCommunityServer = async () => {
  // reboot machine
  const command =
    'bash -c "$(curl -fsSL https://raw.githubusercontent.com/citizenwallet/community/main/scripts/run.sh)"';

  execSync(command, { stdio: "inherit" });
};
