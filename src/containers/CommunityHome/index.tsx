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
import { Box, Flex, IconButton } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight, Download, RotateCcw } from "lucide-react";
import moment from "moment";
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useConfigActions } from "@/state/config/actions";
import { useSafeEffect } from "@/hooks/useSafeEffect";
import { useConfigStore } from "@/state/config/state";

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
  const { offset, limit, total } = useConfigStore(
    (state) => state.transfersMeta
  );
  const [paginationCount, setPaginationCount] = useState("10");

  const onFilterChange = (value: string) => {
    const paginationInNumber = parseInt(value);
    setPaginationCount(value);
    logic.fetchTransactions(community, 0, paginationInNumber, "");
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
        <Card className="max-w-screen-sm min-w-screen-sm">
          <CardHeader>
            <CardTitle className="flex flex-row items-center">
              <Image
                src={community.community.logo}
                alt="community logo"
                height={40}
                width={40}
              />
              {community.community.name}
            </CardTitle>
            <CardDescription>{community.community.description}</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
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
              <Box className="mr-2 cursor-pointer">
                <IconButton
                  className="m-2 "
                  variant="soft"
                  onClick={() => onRefresh()}
                >
                  <RotateCcw />
                </IconButton>
              </Box>
              <Box>
                <IconButton
                  className="m-2 cursor-pointer"
                  variant="soft"
                  color="green"
                >
                  <Download />
                </IconButton>
              </Box>
            </Flex>
          </Flex>
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
                      <TableCell>{shortenAddress(transaction?.hash)}</TableCell>
                      <TableCell>
                        {shortenAddress(transaction?.tx_hash)}
                      </TableCell>
                      <TableCell>
                        {moment(transaction?.created_at).format("DD-MMM-YYYY")}
                      </TableCell>
                      <TableCell>{shortenAddress(transaction?.from)}</TableCell>
                      <TableCell>{shortenAddress(transaction?.to)}</TableCell>
                      <TableCell>{transaction?.value}</TableCell>
                      <TableCell>
                        {shortenAddress(transaction?.data?.description)}
                      </TableCell>
                      <TableCell>{transaction?.status}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <Flex>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    disabled={offset === 0}
                    variant="secondary"
                    onClick={() => onPageChange("prev")}
                  >
                    <ChevronLeft />
                    Previous
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    disabled={transfers.length === 0}
                    variant="secondary"
                    onClick={() => onPageChange("next")}
                  >
                    Next <ChevronRight />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Flex>
        </>
      }
    />
  );
}
