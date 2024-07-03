import { Flex, Section } from "@radix-ui/themes";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Template({
  CommunityCard,
  TransactionTable,
}: {
  CommunityCard?: React.ReactNode;
  TransactionTable?: React.ReactNode;
}) {
  return (
    <Flex direction="column" height="100%" width="100%">
      <Flex direction="column" align="center" p="2">
        <Section size="1">
          {CommunityCard || (
            <Card className="max-w-screen-sm min-w-screen-sm">
              <CardHeader>
                <CardTitle className="flex flex-row items-center">
                  <Skeleton
                    style={{ height: 40, width: 40, borderRadius: 20 }}
                  />
                  <Skeleton style={{ height: 40, minWidth: 100 }} />
                </CardTitle>
                <CardDescription>
                  <Skeleton style={{ height: 40, minWidth: 200 }} />
                </CardDescription>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          )}
          {TransactionTable || (
            <Flex className="flex-col mt-4">
              <Skeleton className="h-[80px] w-[100%] rounded-md" />
              <Skeleton className="h-[30px] w-[100%] rounded-md mt-2" />
              <Skeleton className="h-[30px] w-[100%] rounded-md mt-2" />
              <Skeleton className="h-[30px] w-[100%] rounded-md mt-2" />
              <Skeleton className="h-[30px] w-[100%] rounded-md mt-2" />
              <Skeleton className="h-[60px] w-[100%] rounded-md mt-3" />
            </Flex>
          )}
        </Section>
      </Flex>
    </Flex>
  );
}
