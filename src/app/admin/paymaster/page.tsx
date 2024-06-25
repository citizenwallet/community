import React, { Suspense } from "react";
import { JsonRpcProvider, formatEther } from "ethers";
import { getSponsorAddress, readCommunityFile } from "@/services/community";
import { Config } from "@citizenwallet/sdk";
import ManagePaymaster from "@/containers/ManagePaymaster";
import ManagePaymasterTemplate from "@/templates/ManagePaymaster";
import ErrorPage from "@/templates/ErrorPage";

export default async function Page() {
  let config: Config | undefined;
  try {
    config = readCommunityFile();
  } catch (error) {
    console.error("Error reading community file:", error);
  }

  if (!config) {
    return <ErrorPage description="Community not found" />;
  }

  const provider = new JsonRpcProvider(config.node.url);

  if (!config.erc4337.paymaster_address) {
    throw new Error("Paymaster address not found in community file");
  }

  const sponsorAddress = await getSponsorAddress(
    config.erc4337.paymaster_address,
    provider
  );
  const nativeBalance = await provider.getBalance(sponsorAddress);

  return (
    <Suspense fallback={<ManagePaymasterTemplate />}>
      <ManagePaymaster
        config={config}
        address={sponsorAddress}
        balance={formatEther(nativeBalance)}
      />
    </Suspense>
  );
}
