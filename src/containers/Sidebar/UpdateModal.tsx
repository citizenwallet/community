import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PieChartIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";

export default function UpdateModal() {
  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update in progress</DialogTitle>
          <DialogDescription>
            This page will automatically refresh in 30 seconds.
          </DialogDescription>
        </DialogHeader>
        <Flex justify="center" align="center" className="h-20 w-full">
          <PieChartIcon height={14} width={14} className="animate-spin" />
        </Flex>
      </DialogContent>
    </Dialog>
  );
}
