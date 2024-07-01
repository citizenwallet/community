import CommunityHome from "@/containers/CommunityHome";
import { readCommunityFile } from "@/services/community";
import { Config } from "@citizenwallet/sdk";
import ErrorPage from "@/templates/ErrorPage";
import { useConfigActions } from "@/state/config/actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  let config: Config | undefined;
  try {
    config = readCommunityFile();
  } catch (error) {
    console.error("Error reading community file:", error);
  }

  const logic = useConfigActions();

  if (!config) {
    return <ErrorPage description="Community not found" />;
  }
  const transactions = await logic.fetchTransactions(
    config?.indexer.url,
    config?.token.address,
    0,
    10,
    null
  );

  return <CommunityHome community={config} transactions={transactions} />;
}
