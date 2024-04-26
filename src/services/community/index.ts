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
