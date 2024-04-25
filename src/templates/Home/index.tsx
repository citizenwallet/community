import { Skeleton } from "@/components/ui/skeleton";
import { Box, Flex, Text } from "@radix-ui/themes";

interface Props {
  QRCode?: React.ReactNode;
  SponsorBalance?: React.ReactNode;
}

export default function Template({ QRCode, SponsorBalance }: Props) {
  return (
    <Flex
      direction="column"
      height="100%"
      width="100%"
      className="p-4 mx-auto max-w-screen-md"
    >
      <h1>Welcome to your community</h1>
      <h2>1. Top up your sponsor</h2>
      {SponsorBalance || ""}
      <h2>2. Manage your community (create faucet)</h2>
      <a href="/admin">Go to your dashboard</a>
      <h2>3. Import your community in the Citizen Wallet App</h2>

      <Flex direction="column" align="center" p="2">
        {QRCode || (
          <Box className="p-4 border rounded-lg bg-white">
            <Text>Import Community</Text>
            <Skeleton style={{ height: 262, width: 262 }} className="p-1" />
            <Flex justify="between" align="center" pt="2">
              <Skeleton style={{ height: 32, width: 92 }} className="w-full" />
              <Skeleton style={{ height: 32, width: 92 }} className="w-full" />
            </Flex>
          </Box>
        )}
      </Flex>
    </Flex>
  );
}
