import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Card, Flex, Section, Skeleton } from "@radix-ui/themes";
import React from "react";

const ManagePaymasterTemplate = () => {
  return (
    <Flex direction="column" height="100%" width="100%">
      <Flex direction="column" align="center" p="2">
        <Section size="1">
          <Card className="max-w-screen-sm">
            <CardHeader className="py-0 mb-4">
              <CardTitle>Sponsor</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton style={{ width: 250, height: 250 }} />
              <Flex className="mt-3">
                <Skeleton />
              </Flex>
            </CardContent>
            <CardFooter className="flex justify-end p-0">
              <Skeleton />
            </CardFooter>
          </Card>
        </Section>
      </Flex>
    </Flex>
  );
};

export default ManagePaymasterTemplate;
