import { getSponsorAddress, readCommunityHash } from "@/services/community";
import { redirect } from "next/navigation";
import Home from "@/containers/Home";
import { readCommunityFile } from "@/services/community";
import HomeTemplate from "@/templates/Home";
import { JsonRpcProvider, formatEther } from "ethers";
import { Suspense } from "react";
export const dynamic = "force-dynamic";

export default async function Page() {
  const config = readCommunityFile();
  const hash = readCommunityHash();

  if (!config || !hash) {
    // redirect to /config
    redirect("/config");
  }

  const appBaseUrl = process.env.APP_BASE_URL;

  if (!appBaseUrl) {
    throw new Error("Missing APP_BASE_URL environment variable");
  }

  const appDeepLink = process.env.NATIVE_APP_DEEP_LINK;

  if (!appDeepLink) {
    throw new Error("Missing NATIVE_APP_DEEP_LINK environment variable");
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

  return (
    <Suspense fallback={<HomeTemplate />}>
      <Home
        hash={hash}
        appBaseUrl={appBaseUrl}
        appDeepLink={appDeepLink}
        config={config}
        sponsorBalance={formatEther(nativeBalance)}
        sponsorAddress={sponsorAddress}
      />
    </Suspense>
  );
}
