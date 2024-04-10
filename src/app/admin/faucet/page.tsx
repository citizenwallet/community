import CreateFaucet from "@/containers/CreateFaucet";
import CreateFaucetTemplate from "@/templates/CreateFaucet";
import { Suspense } from "react";
import { readCommunityFile } from "@/services/community";
import { Config } from "@citizenwallet/sdk";
import ErrorPage from "@/templates/ErrorPage";

export const dynamic = "force-dynamic";

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

  return (
    <Suspense fallback={<CreateFaucetTemplate />}>
      <CreateFaucet community={config} />
    </Suspense>
  );
}
