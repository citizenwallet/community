"use client";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { shortenAddress } from "@/utils/shortenAddress";
import { Config } from "@citizenwallet/sdk";
import { Button, Card, Flex, Section, Text } from "@radix-ui/themes";
import { ArrowRightIcon } from "lucide-react";
import React from "react";
import QRCode from "react-qr-code";

interface ManagePaymasterProps {
  config: Config;
  address: string;
  balance: string;
}

const ManagePaymaster = ({
  config,
  address,
  balance,
}: ManagePaymasterProps) => {
  const handleOpenSponsorExplorer = (config: Config, address: string) => {
    const link = `${config.scan.url}/address/${address}`;
    window.open(link);
  };

  const generateQRCode = (config: Config, address: string) => {
    const link = `${config.scan.url}/address/${address}`;
    return link;
  };

  return (
    <Flex direction="column" height="100%" width="100%">
      <Flex direction="column" align="center" p="2">
        <Section size="1">
          <Card className="max-w-screen-sm">
            <CardHeader className="py-0 mb-4">
              <CardTitle>Sponsor</CardTitle>
            </CardHeader>
            <CardContent>
              <QRCode
                size={250}
                style={{
                  height: "auto",
                  maxWidth: "100%",
                  width: "100%",
                }}
                className="animate-fadeIn p-0"
                value={generateQRCode(config, address)}
                viewBox={`0 0 256 256`}
              />
              <Flex className="mt-3">
                <Text>Balance: {balance}</Text>
              </Flex>
            </CardContent>
            <CardFooter className="flex justify-end p-0">
              <Button
                variant="outline"
                onClick={() => handleOpenSponsorExplorer(config, address)}
              >
                {shortenAddress(address)}
                <ArrowRightIcon height={14} width={14} />
              </Button>
            </CardFooter>
          </Card>
        </Section>
      </Flex>
    </Flex>
  );
};

export default ManagePaymaster;
