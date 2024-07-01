"use client";

import { Config } from "@citizenwallet/sdk";
import CommunityHomeTemplate from "@/templates/CommunityHome";
import { Grid } from "@radix-ui/themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortenAddress } from "@/utils/shortenAddress";

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
  array: Transaction | [];
  meta: TransactionsMeta;
}

export default function Container({
  community: { community },
  transactions,
}: {
  community: Config;
  transactions: any; //make an interface
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
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
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
                console.log(transaction);
                return (
                  <TableRow key={transaction.hash}>
                    <TableCell>{shortenAddress(transaction?.hash)}</TableCell>
                    <TableCell>
                      {shortenAddress(transaction?.tx_hash)}
                    </TableCell>
                    <TableCell>{transaction?.created_at}</TableCell>
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
      }
    />
  );
}
