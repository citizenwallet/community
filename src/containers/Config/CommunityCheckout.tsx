import {
  CommunityFactoryContractService,
  Network,
  SessionService,
  useCheckout,
  useCommunityFactoryContract,
  useSafeEffect,
} from "@citizenwallet/sdk";
import SessionCard from "@/components/SessionCard";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Flex, Separator, Text } from "@radix-ui/themes";

export default function Container({
  network,
  sponsor,
  token,
  loading = false,
  onValidityChange,
  onCheckout,
}: {
  network: Network;
  sponsor: string;
  token: string;
  loading: boolean;
  onValidityChange?: (valid: boolean) => void;
  onCheckout: (
    owner: string,
    factoryService: CommunityFactoryContractService,
    checkoutService: SessionService
  ) => Promise<boolean>;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [subscribe, actions] = useCheckout(network);
  const [factorySubscribe, factoryActions] = useCommunityFactoryContract(
    network,
    actions.getSessionService()
  );

  useSafeEffect(() => {
    actions.onLoad();
    actions.listenToBalance();
    actions.updateAmountToPay((signer) => {
      return factoryActions.communityFactoryService.estimateCreate(
        signer.address,
        sponsor,
        token,
        0
      );
    });
  }, [actions, factoryActions, sponsor, token]);

  const sessionAddress = subscribe((state) => state.sessionAddress);
  const sessionBalance = subscribe((state) => state.sessionBalance);
  const amountToPay = subscribe((state) => state.amountToPay);
  const sessionOwner = subscribe((state) => state.sessionOwner);
  const sessionOwnerError = subscribe((state) => state.sessionOwnerError);

  const refund = subscribe((state) => state.refund);

  const isCheckingOut = factorySubscribe((state) => state.create.loading);

  useSafeEffect(() => {
    if (sessionOwner && token) {
      actions.updateAmountToPay((_) => {
        return factoryActions.communityFactoryService.estimateCreate(
          sessionOwner,
          sponsor,
          token,
          0
        );
      });
    }
  }, [actions, factoryActions, sessionOwner, sponsor, token]);

  const handleCheckout = async () => {
    if (!sessionOwner) return;
    actions.stopListeners();

    const success = await onCheckout(
      sessionOwner,
      factoryActions.communityFactoryService,
      actions.getSessionService()
    );

    if (!success) {
      actions.listenToBalance();
    }
  };

  const handleCancel = () => {
    actions.refund();
  };

  const FundingCardContent = (
    <SessionCard
      isDesktop={!!isDesktop}
      fundingItemName="Community publication"
      network={network}
      sessionAddress={sessionAddress}
      amountToPay={amountToPay}
      sessionBalance={sessionBalance}
      sessionOwner={sessionOwner}
      sessionOwnerError={sessionOwnerError}
      actions={actions}
      AdditionalInfo={
        <Flex
          direction="column"
          align="center"
          className="w-full"
          gap="2"
          pt="4"
        >
          <Text>Anyone can top up the faucet.</Text>
          <Separator size="4" />
          <Text className="text-center">
            Only the owner can withdraw from the faucet.
          </Text>
        </Flex>
      }
      onValidityChange={onValidityChange}
      onCheckout={handleCheckout}
      onCancel={handleCancel}
      isCheckingOut={isCheckingOut || loading}
      isRefunding={refund.loading}
    />
  );

  return FundingCardContent;
}
