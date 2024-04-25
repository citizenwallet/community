import { ethers, formatEther, formatUnits, JsonRpcProvider } from "ethers";

import accountFactoryContractAbi from "smartcontracts/build/contracts/accfactory/AccountFactory.abi";
import tokenContractAbi from "smartcontracts/build/contracts/erc20/ERC20.abi";
import { readCommunityFile } from "@/services/community";

export const dynamic = "force-dynamic";

async function getSponsorAddress(paymasterContractAddress, provider) {
  const abi = ["function sponsor() public view returns (address)"];

  const contract = new ethers.Contract(paymasterContractAddress, abi, provider);

  const sponsorAddress = await contract.sponsor();

  return sponsorAddress;
}

export async function GET(req, res) {
  const config = await readCommunityFile();
  const tokenContractAddress = config.token.address;

  const provider = new JsonRpcProvider(config.node.url);

  const sponsorAddress = await getSponsorAddress(
    config.erc4337.paymaster_address,
    provider
  );

  const tokenContract = new ethers.Contract(
    tokenContractAddress,
    tokenContractAbi,
    provider
  );

  const nativeBalance = await provider.getBalance(sponsorAddress);
  const tokenSymbol = await tokenContract.symbol();
  const tokenDecimals = await tokenContract.decimals();
  const decimals = parseInt(tokenDecimals, 10);

  const data = {
    tokenContractAddress,
    tokenSymbol,
    tokenDecimals: decimals,
    sponsorAddress,
    nativeBalance: formatEther(nativeBalance),
    config,
  };

  return Response.json(data);
}
