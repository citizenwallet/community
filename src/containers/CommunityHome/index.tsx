"use client";

import { Config } from "@citizenwallet/sdk";
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
  TableFooter,
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

interface TransactionsMeta {
  limit: number;
  offset: number;
  total: number;
}

interface Description {
  description: string;
}

interface Transaction {
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

interface Transactions {
  response_type: string;
  array: Transaction[] | [];
  meta: TransactionsMeta;
}

export default function Container({
  community: { community },
  transactions,
}: {
  community: Config;
  transactions: Transactions;
}) {
  console.log(transactions);
  return (
    <CommunityHomeTemplate
      CommunityCard={
        <Card className="max-w-screen-sm min-w-screen-sm">
          <CardHeader>
            <CardTitle className="flex flex-row items-center">
              <Image
                src={community.logo}
                alt="community logo"
                height={40}
                width={40}
              />
              {community.name}
            </CardTitle>
            <CardDescription>{community.description}</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      }
      TransactionTable={
        <>
          <Flex justify="between" align="center" className="py-4 mt-2">
            <Select>
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
              <Box className="mr-2">
                <IconButton className="m-2" variant="soft">
                  <RotateCcw />
                </IconButton>
              </Box>
              <Box>
                <IconButton className="m-2" variant="soft" color="green">
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
              {transactions &&
                transactions?.array.map((transaction: Transaction) => {
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
                      <TableCell>{transaction?.data?.description}</TableCell>
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
                  <Button variant="secondary">
                    {" "}
                    <ChevronLeft />
                    Previous
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button variant="secondary">
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
