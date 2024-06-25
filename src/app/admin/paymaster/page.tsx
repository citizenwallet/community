import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SheetContent } from "@/components/ui/sheet";
import { Button, Card, Flex, Section, Text } from "@radix-ui/themes";
import { ArrowRightIcon, Sheet } from "lucide-react";
import React from "react";
import QRCode from "react-qr-code";

const page = () => {
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
                value=""
                viewBox={`0 0 256 256`}
              />
              <Flex className="mt-3">
                <Text>Balance: </Text>
              </Flex>
            </CardContent>
            <CardFooter className="flex justify-end p-0">
              <Button variant="outline">
                Go to your dashboard
                <ArrowRightIcon height={14} width={14} />
              </Button>
            </CardFooter>
          </Card>
        </Section>
      </Flex>
    </Flex>
  );
};

export default page;
