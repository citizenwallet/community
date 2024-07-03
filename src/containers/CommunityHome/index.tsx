"use client";

import { Config, Transfer } from "@citizenwallet/sdk";
import CommunityHomeTemplate from "@/templates/CommunityHome";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortenAddress } from "@/utils/shortenAddress";
import { Box, Flex, IconButton, Skeleton, Strong } from "@radix-ui/themes";
import { Button as ControlButton } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  MoveUpRight,
  RotateCcw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@radix-ui/themes";
import { useState } from "react";
import { useConfigActions } from "@/state/config/actions";
import { useSafeEffect } from "@/hooks/useSafeEffect";
import { useConfigStore } from "@/state/config/state";
import { formatDate } from "@/utils/dateFormat";
import { formatUnits } from "ethers";

export interface TransactionsMeta {
  limit: number;
  offset: number;
  total: number;
}

export interface Description {
  description: string;
}

export interface Transaction {
  hash: string;
  tx_hash: string;
  token_id: number;
  created_at: string;
  from: string;
  to: string;
  nonce: number;
  value: number;
  data: Description;
  status: string;
}

export interface Transactions {
  response_type: string;
  array: Transaction[] | [];
  meta: TransactionsMeta;
}

export default function Container({ community }: { community: Config }) {
  const logic = useConfigActions();
  const transfers = useConfigStore((state) => state.transfers);
  const transfersLoading = useConfigStore((state) => state.transfersLoading);
  const { offset } = useConfigStore((state) => state.transfersMeta);
  const [paginationCount, setPaginationCount] = useState("10");

  const onFilterChange = (value: string) => {
    const paginationInNumber = parseInt(value);
    setPaginationCount(value);
    logic.fetchTransactions(community, 0, paginationInNumber, "");
  };

  const onOpenWebsite = (url: string) => {
    window.open(url);
  };

  const onOpenAccount = (url: string, address: string) => {
    const link = `${url}/address/${address}`;
    window.open(link);
  };

  const onPageChange = (direction: string) => {
    const paginationInNumber = parseInt(paginationCount);
    if (direction === "next") {
      logic.fetchTransactions(
        community,
        offset + paginationInNumber,
        paginationInNumber,
        ""
      );
    } else {
      logic.fetchTransactions(
        community,
        offset - paginationInNumber,
        parseInt(paginationCount),
        ""
      );
    }
  };

  const onRefresh = () => {
    const paginationInNumber = parseInt(paginationCount);
    logic.fetchTransactions(
      community,
      0,
      paginationInNumber,
      Date.now().toString()
    );
  };

  useSafeEffect(() => {
    logic.fetchInitialTransactions(community);
  }, []);
  return (
    <CommunityHomeTemplate
      CommunityCard={
        <Card className="max-w-screen-lg min-w-screen-sm">
          <CardHeader>
            <Flex>
              <Image
                src={community.community.logo}
                alt="community logo"
                height={90}
                width={90}
              />
              <Flex className="flex flex-col">
                <CardTitle className="mb-1">
                  {community.community.name}
                </CardTitle>
                <CardDescription className="mb-1">
                  {community.community.description}
                </CardDescription>
                <Button
                  className="w-[100px]"
                  variant="outline"
                  onClick={() => onOpenWebsite(community.community.url)}
                >
                  Website
                  <MoveUpRight className="ml-1" height={14} width={14} />
                </Button>
              </Flex>
            </Flex>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-1">
              <Strong> Token:</Strong> {community.token.name}
            </CardDescription>

            <CardDescription className="mb-1">
              <Strong>Symbol: </Strong>
              {community.token.symbol}
            </CardDescription>
            <CardDescription className="mb-1">
              <Strong>Standard:</Strong> {community.token.standard}
            </CardDescription>
            <CardDescription className="mb-2">
              <Strong> Decimals:</Strong> {community.token.decimals}
            </CardDescription>
            <Button
              variant="outline"
              onClick={() =>
                onOpenAccount(community.scan.url, community.token.address)
              }
            >
              View on {community.scan.name}
            </Button>
          </CardContent>
        </Card>
      }
      TransactionTable={
        <>
          <Flex justify="between" align="center" className="py-4 mt-2">
            <Select
              value={paginationCount}
              onValueChange={(value) => onFilterChange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <Flex>
              <Box className="cursor-pointer">
                <IconButton
                  className="m-2"
                  variant="soft"
                  onClick={() => onRefresh()}
                >
                  <RotateCcw />
                </IconButton>
              </Box>
            </Flex>
          </Flex>
          {transfersLoading ? (
            <Skeleton
              className="mb-3"
              style={{ height: 600, width: 900 }}
            ></Skeleton>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transfer Hash</TableHead>
                  <TableHead>Transaction Hash</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers &&
                  transfers?.map((transaction: Transfer) => {
                    return (
                      <TableRow key={transaction.hash}>
                        <TableCell>
                          {shortenAddress(transaction?.hash)}
                        </TableCell>
                        <TableCell>
                          {shortenAddress(transaction?.tx_hash)}
                        </TableCell>
                        <TableCell>
                          {formatDate(transaction?.created_at)}
                        </TableCell>
                        <TableCell>
                          {shortenAddress(transaction?.from)}
                        </TableCell>
                        <TableCell>{shortenAddress(transaction?.to)}</TableCell>
                        <TableCell>
                          {formatUnits(
                            `${transaction?.value ?? 0}`,
                            community.token.decimals
                          )}
                        </TableCell>
                        <TableCell>
                          {shortenAddress(transaction?.data?.description)}
                        </TableCell>
                        <TableCell>{transaction?.status}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
          <Flex className="mt-2 {moment(transaction?.created_at).format(">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <ControlButton
                    disabled={offset === 0}
                    variant="secondary"
                    onClick={() => onPageChange("prev")}
                  >
                    <ChevronLeft />
                    Previous
                  </ControlButton>
                </PaginationItem>
                <PaginationItem>
                  <ControlButton
                    disabled={transfers.length === 0}
                    variant="secondary"
                    onClick={() => onPageChange("next")}
                  >
                    Next <ChevronRight />
                  </ControlButton>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Flex>
        </>
      }
    />
  );
}
