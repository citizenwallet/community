import CommunityHome from "@/containers/CommunityHome";
import { readCommunityFile } from "@/services/community";
import { Config } from "@citizenwallet/sdk";
import ErrorPage from "@/templates/ErrorPage";
import { Box, Flex } from "@radix-ui/themes";

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

  return <CommunityHome community={config} />;
}
