"use client";

import HomeTemplate from "@/templates/Home";
import { shortenAddress } from "@/utils/shortenAddress";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";
import { useRouter } from "next/navigation";
import { Config, NETWORKS, Network, useSafeEffect } from "@citizenwallet/sdk";
import { useSponsorBalance } from "@/services/api/sponsor";
interface ContainerProps {
  hash: string;
  appBaseUrl: string;
  appDeepLink: string;
  config: Config;
}

export default function Container({
  hash,
  appBaseUrl,
  appDeepLink,
  config,
}: ContainerProps) {
  const [webWallet, setWebWallet] = useState<string>("");
  const { data, isLoading } = useSponsorBalance();
  const router = useRouter();

  useSafeEffect(() => {
    setWebWallet(window.location.origin ?? "");
  }, []);

  const faucetDeepLink = `?dl=community&community=${hash}`;

  const qrLink = `${appBaseUrl}${faucetDeepLink}`;

  const network: Network = NETWORKS[config.node.chain_id];

  const handleOpenSponsorExplorer = (address: string) => {
    const link = `${config.scan.url}/address/${address}`;
    window.open(link);
  };

  const gotoDashboard = () => {
    router.push(`/admin`);
  };

  const handleOpenApp = () => {
    const link = `${appDeepLink}/#/${faucetDeepLink}`;
    window.open(link);
  };

  const handleCreateWebWallet = () => {
    window.open(webWallet, "_blank");
  };

  return (
    <HomeTemplate
      SponsorBalance={
        data &&
        !isLoading && (
          <Flex direction="column" align="center" p="2" gap="4">
            <Text>
              Balance: {data.balance} {network.symbol}
            </Text>
            <Button
              variant="outline"
              onClick={() => handleOpenSponsorExplorer(data.address)}
            >
              {shortenAddress(data.address)}{" "}
              <ArrowUpRight height={14} width={14} />
            </Button>
          </Flex>
        )
      }
      DashboardButton={
        <Button variant="outline" onClick={gotoDashboard}>
          Go to your dashboard
          <ArrowRightIcon height={14} width={14} />
        </Button>
      }
      WebCreateQRCode={
        <Box className="p-4 border rounded-lg bg-white">
          <Text>Create a web wallet</Text>
          <QRCode
            size={256}
            style={{
              height: "auto",
              maxWidth: "100%",
              width: "100%",
            }}
            className="animate-fadeIn p-1"
            value={webWallet}
            viewBox={`0 0 256 256`}
          />
          <Flex justify="center" align="center" pt="2">
            <Button variant="outline" onClick={handleCreateWebWallet}>
              Create Web Wallet <ArrowUpRight height={14} width={14} />
            </Button>
          </Flex>{" "}
        </Box>
      }
      ImportAppQRCode={
        <Box className="p-4 border rounded-lg bg-white">
          <Text>Import Community</Text>
          <QRCode
            size={256}
            style={{
              height: "auto",
              maxWidth: "100%",
              width: "100%",
            }}
            className="animate-fadeIn p-1"
            value={qrLink}
            viewBox={`0 0 256 256`}
          />
          <Flex justify="center" align="center" pt="2">
            <Button variant="outline" onClick={handleOpenApp}>
              Open App <ArrowUpRight height={14} width={14} />
            </Button>
          </Flex>{" "}
        </Box>
      }
    />
  );
}
