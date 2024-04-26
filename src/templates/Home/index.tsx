import { Skeleton } from "@/components/ui/skeleton";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";

interface Props {
  SponsorBalance?: React.ReactNode;
  DashboardButton?: React.ReactNode;
  WebCreateQRCode?: React.ReactNode;
  ImportAppQRCode?: React.ReactNode;
}

export default function Template({
  SponsorBalance,
  DashboardButton,
  WebCreateQRCode,
  ImportAppQRCode,
}: Props) {
  return (
    <Flex
      direction="column"
      height="100%"
      width="100%"
      justify="start"
      align="center"
      p="4"
      className="relative fadeIn min-h-screen max-w-screen-sm mx-auto animate-fadeIn"
    >
      <Flex direction="column" align="center" p="2" gap="4">
        <Heading>Welcome to your community</Heading>
        <Flex direction="column" align="center" p="2" gap="2">
          <Heading size="5" weight="regular">
            1. Top up your sponsor
          </Heading>
          {SponsorBalance || (
            <Flex direction="column" align="center" p="2" gap="2">
              <Text>Balance: ...</Text>
              <Skeleton style={{ height: 32, width: 126 }} className="w-full" />
            </Flex>
          )}
        </Flex>
        <Flex direction="column" align="center" p="2" gap="2">
          <Heading size="5" weight="regular">
            2. Manage your community (create faucet)
          </Heading>
          {DashboardButton || (
            <Skeleton style={{ height: 32, width: 189 }} className="w-full" />
          )}
        </Flex>
        <Flex direction="column" align="center" p="2" gap="2">
          <Heading size="5" weight="regular">
            3. Start
          </Heading>
          {WebCreateQRCode || (
            <Box className="p-4 border rounded-lg bg-white">
              <Text>Import Community</Text>
              <Skeleton style={{ height: 262, width: 262 }} className="p-1" />
              <Flex justify="center" align="center" pt="2">
                <Skeleton
                  style={{ height: 32, width: 168 }}
                  className="w-full"
                />
              </Flex>
            </Box>
          )}
        </Flex>
        <Heading size="5" weight="regular">
          OR
        </Heading>
        <Flex direction="column" align="center" p="2" gap="2">
          {ImportAppQRCode || (
            <Box className="p-4 border rounded-lg bg-white">
              <Text>Import Community</Text>
              <Skeleton style={{ height: 262, width: 262 }} className="p-1" />
              <Flex justify="center" align="center" pt="2">
                <Skeleton
                  style={{ height: 32, width: 168 }}
                  className="w-full"
                />
              </Flex>
            </Box>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
