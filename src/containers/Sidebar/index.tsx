"use client";

import { Flex, Heading, Separator, Text, Theme } from "@radix-ui/themes";
import Tabs, { Tab } from "./Tabs";
import { Button } from "@/components/ui/button";
import {
  ExternalLinkIcon,
  GitHubLogoIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import useMediaQuery from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { usePrevious } from "@/hooks/usePrevious";
import { VERSION } from "@/constants/version";
import { useServer } from "@/state/server/actions";
import ConfirmModal from "../../components/ConfirmModal";
import UpdateModal from "./UpdateModal";

interface SidebarProps {
  title: string;
  newVersion?: string;
  oldVersion?: string;
}

export default function Sidebar({
  title,
  newVersion,
  oldVersion,
}: SidebarProps) {
  let tabs: Tab[] = [
    { href: `/admin/`, item: "", label: "Home" },
    { href: `/admin/faucet`, item: "faucet", label: "Faucet" },
    { href: `/admin/paymaster`, item: "paymaster", label: "Paymaster" },
    { href: `/admin/system`, item: "system", label: "System" },
  ];

  console.log("newVersion", newVersion);
  console.log("oldVersion", oldVersion);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const [state, actions] = useServer();

  const previousPathname = usePrevious(pathname);

  useEffect(() => {
    if (previousPathname !== undefined && previousPathname !== pathname) {
      setOpen(false);
    }
  }, [pathname, previousPathname]);

  const handleContribute = () => {
    window.open(
      "https://github.com/citizenwallet/dashboard",
      "https://github.com/citizenwallet/dashboard"
    );
  };

  const handleCitizenWallet = () => {
    window.open("https://citizenwallet.xyz", "https://citizenwallet.xyz");
  };

  const handleUpdate = async () => {
    actions.update();
  };

  const updating = state((s) => s.updating);

  if (isDesktop === undefined) {
    return null;
  }

  if (isDesktop) {
    return (
      <Flex
        style={{ width: 300 }}
        direction="column"
        p="2"
        gap="2"
        className="animate-fadeIn min-h-screen bg-white"
      >
        <Heading>{title}</Heading>
        <Separator size="4" />
        <Tabs pathname={pathname} tabs={tabs} />
        <Flex grow="1"></Flex>
        <Flex direction="column">
          <Button variant="ghost" onClick={handleContribute}>
            <GitHubLogoIcon className="mr-2 h-4 w-4" /> Contribute
            <ExternalLinkIcon className="ml-2" />
          </Button>
          <Button variant="ghost" onClick={handleCitizenWallet}>
            Citizen Wallet
            <ExternalLinkIcon className="ml-2" />
          </Button>
          {updating && <UpdateModal />}
          {newVersion && (
            <ConfirmModal
              title="Update Server"
              description="This will download and install the latest version of web wallet, indexer and dashboard. This process can take a few seconds. After the update is complete, this page will need to be refreshed."
              confirmText="Update"
              onConfirm={handleUpdate}
            >
              <>
                <Button disabled={updating}>
                  Update available v{newVersion}
                </Button>
                <Text size="1" align="center">
                  Dashboard: v{VERSION}
                </Text>
              </>
            </ConfirmModal>
          )}
          {!newVersion && (
            <Flex justify="center" align="center" className="h-10">
              <Text size="1" align="center">
                Dashboard: v{VERSION}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    );
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="absolute top-2 left-2" variant="outline">
          <HamburgerMenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <Theme
          accentColor="purple"
          grayColor="sand"
          radius="large"
          className="h-full animate-fadeIn"
        >
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <Flex
            style={{ width: 300 }}
            direction="column"
            p="2"
            gap="2"
            className="h-full"
          >
            <Separator size="4" />
            <Flex grow="1"></Flex>
            <Flex direction="column">
              <Button variant="ghost" onClick={handleContribute}>
                <GitHubLogoIcon className="mr-2 h-4 w-4" /> Contribute
                <ExternalLinkIcon className="ml-1" />
              </Button>
              <Button variant="ghost" onClick={handleCitizenWallet}>
                Citizen Wallet
                <ExternalLinkIcon className="ml-1" />
              </Button>
              {updating && <UpdateModal />}
              {newVersion && (
                <ConfirmModal
                  title="Update Server"
                  description="This will download and install the latest version of web wallet, indexer and dashboard. This process can take a few seconds. After the update is complete, this page will need to be refreshed."
                  confirmText="Update"
                  onConfirm={handleUpdate}
                >
                  <>
                    <Button disabled={updating}>
                      Update available v{newVersion}
                    </Button>

                    <Text size="1" align="center">
                      Dashboard: v{VERSION}
                    </Text>
                  </>
                </ConfirmModal>
              )}
              {!newVersion && (
                <Flex justify="center" align="center" className="h-10">
                  <Text size="1" align="center">
                    Dashboard: v{VERSION}
                  </Text>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Theme>
      </SheetContent>
    </Sheet>
  );
}
