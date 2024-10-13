import { useEffect, useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useNetworkVariable } from "./networkConfig";
import type { SuiObjectData } from "@mysten/sui/client"; // Ajout de l'importation manquante

export function Campaign({ id }: { id: string }) {
  const campaignPackageId = useNetworkVariable("campaignPackageId");
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showEffects: true,
        },
      }),
  });

  const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
    id,
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  // State to store donation amount
  const [donationAmount, setDonationAmount] = useState<number>(0);

  useEffect(() => {
    // Vérifier si `data?.data` existe avant d'appeler `getCampaignFields`
    if (data?.data) {
      const fields = getCampaignFields(data.data);
      if (fields && fields.amount >= parseInt(fields.objective)) {
        alert("Congratulations! The campaign has reached its goal!");
      }
    }
  }, [data]);

  const executeMoveCall = (method: "donate" | "reset") => {
    const tx = new Transaction();

    if (method === "reset") {
      tx.moveCall({
        arguments: [tx.object(id), tx.pure.u64(0)],
        target: `${campaignPackageId}::campaign::set_value`,
      });
    } else if (method === "donate") {
      tx.moveCall({
        arguments: [tx.object(id), tx.pure.u64(donationAmount)], // Use donation amount here
        target: `${campaignPackageId}::campaign::donate`,
      });
    }

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async () => {
          await refetch();
        },
      },
    );
  };

  if (isPending) return <Text>Loading...</Text>;

  if (error) return <Text>Error: {error.message}</Text>;

  if (!data.data) return <Text>Not found</Text>;

  const ownedByCurrentAccount =
    getCampaignFields(data.data)?.owner === currentAccount?.address;

  return (
    <>
      <Heading size="3">Campaign {id}</Heading>

      <Flex direction="column" gap="2">
        <Text>Campaign: {getCampaignFields(data.data)?.name as string}</Text>
        <Text>Objective: {getCampaignFields(data.data)?.objective as string}</Text>
        <Text>Amount: {getCampaignFields(data.data)?.amount as number}</Text>
        <Text>Description: {getCampaignFields(data.data)?.description as string}</Text>
        
        {/* Input field for donation amount */}
        <input
          type="number"
          placeholder="Enter donation amount"
          value={donationAmount}
          onChange={(e) => setDonationAmount(Number(e.target.value))}
          style={{ padding: '8px', fontSize: '16px', width: '200px', marginBottom: '10px' }}
        />
        
        <Flex direction="row" gap="2">
          <Button onClick={() => executeMoveCall("donate")}>Donate</Button>
          {ownedByCurrentAccount ? (
            <Button onClick={() => executeMoveCall("reset")}>Reset</Button>
          ) : null}
        </Flex>
      </Flex>
    </>
  );
}

function getCampaignFields(data: SuiObjectData) {
  if (data.content?.dataType !== "moveObject") {
    return null;
  }

  return data.content.fields as { owner: string; objective: string, amount: number, name: string, description: string };
}
