"use client";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Card, Flex, Section, Text } from "@radix-ui/themes";
import { Check, X } from "lucide-react";
import React from "react";

export interface StatusItem {
  id: string;
  label: string;
  ok: boolean;
}

interface SystemProps {
  items: StatusItem[];
}

const System = ({ items }: SystemProps) => {
  // TODO: Implement restart functionality on a per service basis
  // const handleItemRestart = (item: StatusItem) => {
  //   console.log("Restarting", item.label);
  // };

  return (
    <Flex direction="column" height="100%" width="100%">
      <Flex direction="column" align="center" p="2">
        <Section size="1">
          <Card className="max-w-screen-sm">
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Flex direction="column" gap="4" className="mt-3">
                {items.map((item) => (
                  <Flex key={item.id} justify="between" align="center">
                    <Text className="w-60 truncate">{item.label}</Text>
                    {/* <Button onClick={() => handleItemRestart(item)}>
                      Restart
                    </Button> */}
                    {item.ok ? (
                      <Check size={24} className="mx-4" color="green" />
                    ) : (
                      <X size={24} className="mx-4" />
                    )}
                  </Flex>
                ))}
              </Flex>
            </CardContent>
          </Card>
        </Section>
      </Flex>
    </Flex>
  );
};

export default System;
