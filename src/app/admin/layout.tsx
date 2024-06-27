import Sidebar from "@/containers/Sidebar";
import { VERSION } from "@/constants/version";
import { getDashboardVersion, readCommunityFile } from "@/services/community";
import { compareSemver } from "@/utils/semver";
import { Flex, Separator } from "@radix-ui/themes";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = readCommunityFile();

  const version = await getDashboardVersion();

  const hasUpdate = compareSemver(VERSION, version) === -1;

  return (
    <Flex className="min-h-screen bg-background font-sans antialiased">
      {config && (
        <Sidebar
          title={config.community.name}
          newVersion={hasUpdate ? version : undefined}
        />
      )}
      <Flex direction="column">
        <Separator orientation="vertical" size="4" />
      </Flex>
      {children}
    </Flex>
  );
}
