import { ethers, formatEther, JsonRpcProvider } from "ethers";

import { readCommunityFile } from "@/services/community";

export const dynamic = "force-dynamic";

async function getSponsorAddress(
  paymasterContractAddress: string,
  provider: JsonRpcProvider
) {
  const abi = ["function sponsor() public view returns (address)"];

  const contract = new ethers.Contract(paymasterContractAddress, abi, provider);

  const sponsorAddress = await contract.sponsor();

  return sponsorAddress;
}

export interface SponsorBalanceResponse {
  address: string;
  balance: string;
}

export async function GET(req: Request) {
  try {
    const config = readCommunityFile();
    if (!config) {
      throw new Error("Community file not found");
    }

    if (!config.erc4337.paymaster_address) {
      throw new Error("Paymaster address not found in community file");
    }

    const provider = new JsonRpcProvider(config.node.url);

    const sponsorAddress = await getSponsorAddress(
      config.erc4337.paymaster_address,
      provider
    );

    const nativeBalance = await provider.getBalance(sponsorAddress);

    const data: SponsorBalanceResponse = {
      address: sponsorAddress,
      balance: formatEther(nativeBalance),
    };

    return Response.json(data);
  } catch (error: any) {
    console.log("Error writing file", error);
    return Response.json(
      { message: "Error writing file", error: error.message },
      { status: 500 }
    );
  }
}
