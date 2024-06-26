import RedeemFaucetToAccount from "@/containers/RedeemFaucetToAccount";
import RedeemFaucetToAccountTemplate from "@/templates/RedeemFaucetToAccount";
import { Suspense } from "react";
import { readCommunityFile } from "@/services/community";
import { Config } from "@citizenwallet/sdk";
import ErrorPage from "@/templates/ErrorPage";

export const dynamic = "force-dynamic";

export default async function Page({
  params: { faucetAddress, account },
}: {
  params: { faucetAddress: string; account: string };
}) {
  let config: Config | undefined;
  try {
    config = readCommunityFile();
  } catch (error) {
    console.error("Error reading community file:", error);
  }

  if (!config) {
    return <ErrorPage title="Community not found" />;
  }

  const appBaseUrl = process.env.APP_BASE_URL;

  if (!appBaseUrl) {
    throw new Error("Missing APP_BASE_URL environment variable");
  }

  const appDeepLink = process.env.NATIVE_APP_DEEP_LINK;

  if (!appDeepLink) {
    throw new Error("Missing NATIVE_APP_DEEP_LINK environment variable");
  }

  return (
    <Suspense fallback={<RedeemFaucetToAccountTemplate />}>
      <RedeemFaucetToAccount
        config={config}
        faucetAddress={faucetAddress}
        account={account}
        appBaseUrl={appBaseUrl}
        appDeepLink={appDeepLink}
      />
    </Suspense>
  );
}
