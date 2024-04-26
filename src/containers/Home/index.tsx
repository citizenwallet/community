"use client";

import HomeTemplate from "@/templates/Home";
import { shortenAddress } from "@/utils/shortenAddress";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useRouter } from "next/navigation";
import { Config } from "@citizenwallet/sdk";
import useStatus from "@/hooks/useStatus";
interface ContainerProps {
  hash: string;
  appBaseUrl: string;
  appDeepLink: string;
  config: Config;
}

const nativeCurrency = {
  "1": "ETH",
  "4": "ETH",
  "10": "ETH", // optimism
  "5": "XDAI",
  "42220": "CELO",
  "44787": "CELO",
  "8453": "ETH", // base
  "84532": "ETH", // base
  "100": "xDAI",
  "80001": "MATIC",
  "137": "MATIC",
  "43113": "AVAX",
  "43114": "AVAX",
};

export default function Container({
  hash,
  appBaseUrl,
  appDeepLink,
  config,
}: ContainerProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [copied, setCopied] = useState(false);
  const { status } = useStatus();
  const router = useRouter();

  const faucetDeepLink = `?dl=community&community=${hash}`;

  const qrLink = `${appBaseUrl}${faucetDeepLink}`;

  console.log("qrLink", qrLink);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  };

  const gotoDashboard = () => {
    router.push(`/admin`);
  };

  const handleOpenApp = () => {
    const link = `${appDeepLink}/#/${faucetDeepLink}`;
    window.open(link);
  };

  return (
    <HomeTemplate
      SponsorBalance={
        <div>
          {status && (
            <div>
              <a
                href={`${status.config.scan.url}/address/${status.sponsorAddress}`}
              >
                {status.sponsorAddress}
              </a>
              <div>
                Balance: {status.nativeBalance}{" "}
                {
                  nativeCurrency[
                    status.config.node.chain_id as keyof typeof nativeCurrency
                  ]
                }
              </div>
            </div>
          )}
        </div>
      }
      QRCode={
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
          <Flex justify="between" align="center" pt="2">
            <Button
              variant="outline"
              color="gray"
              onClick={() => handleCopy(qrLink)}
            >
              {shortenAddress(hash)}{" "}
              {copied ? (
                <CheckIcon height={14} width={14} />
              ) : (
                <CopyIcon height={14} width={14} />
              )}
            </Button>
            <Button variant="outline" onClick={handleOpenApp}>
              Open App <ArrowUpRight height={14} width={14} />
            </Button>
          </Flex>{" "}
        </Box>
      }
    />
  );
}
