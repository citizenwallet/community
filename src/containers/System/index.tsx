"use client";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card, Flex, Section, Text } from "@radix-ui/themes";
import { Check, X } from "lucide-react";
import React from "react";

export interface StatusItem {
  label: string;
  ok: boolean;
}

interface SystemProps {
  items: StatusItem[];
}

const System = ({ items }: SystemProps) => {
  return (
    <Flex direction="column" height="100%" width="100%">
      <Flex direction="column" align="center" p="2">
        <Section size="1">
          <Card className="max-w-screen-sm w-60">
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Flex direction="column" gap="4" className="mt-3">
                {items.map((item) => (
                  <Flex key={item.label} justify="between">
                    <Text>{item.label}</Text>
                    {item.ok ? <Check size={24} /> : <X size={24} />}
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
