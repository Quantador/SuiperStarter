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

  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [transactionCompleted, setTransactionCompleted] = useState(false);
  const [goalReached, setGoalReached] = useState(false);
  const [campaignData, setCampaignData] = useState<any>(null);

  // Re-fetch campaign data if a transaction was completed
  useEffect(() => {
    if (transactionCompleted) {
      refetch().then((newData) => {
        setCampaignData(newData?.data); // Update campaign data locally
        setTransactionCompleted(false); // Reset transaction state
      });
    }
  }, [transactionCompleted, refetch]);

  // Show alert if goal is reached
  useEffect(() => {
    if (goalReached) {
      setTimeout(() => {
        alert("Congratulations! The campaign has reached its goal!");
      }, 500);
    }
  }, [goalReached]);

  // Check if the campaign goal is reached
  useEffect(() => {
    if (data?.data) {
      const fields = getCampaignFields(data.data);
      if (fields && fields.amount >= parseInt(fields.objective) && !goalReached) {
        setGoalReached(true);
      }
    }
  }, [data, goalReached]);

  const executeMoveCall = (method: "donate" | "reset") => {
    const tx = new Transaction();
    if (method === "reset") {
      tx.moveCall({
        arguments: [tx.object(id), tx.pure.u64(0)],
        target: `${campaignPackageId}::campaign::set_value`,
        
      });
    } if (method === "donate") {
      tx.moveCall({
        arguments: [tx.object(id), tx.pure.u64(donationAmount)],
        target: `${campaignPackageId}::campaign::donate`,
      });
    }

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async (result) => {
          console.log("Transaction successful:", result);
          setTransactionCompleted(true);
          refetch()
        },
        onError: (error) => {
          console.error("Transaction failed:", error);
        },
      }
    );
  };

  if (isPending) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!data.data) return <Text>Not found</Text>;

  const fields = getCampaignFields(data.data);
  const ownedByCurrentAccount = fields?.owner === currentAccount?.address;

  // Calculate donation progress percentage
  const objective = parseInt(fields.objective);
  const amount = fields.amount;
  const progress = (amount / objective) * 100;

  return (
    <>
      <Heading size="3">Campaign {id}</Heading>
      <Flex direction="column" gap="2">
        <Text>Campaign: {fields?.name as string}</Text>
        <Text>Objective: {fields?.objective as string}</Text>
        <Text>Amount: {fields?.amount as number}</Text>
        <Text>Description: {fields?.description as string}</Text>

        {/* Progress Bar */}
        <div style={{ margin: '10px 0' }}>
          <Text>Progress:</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <progress
              value={amount}
              max={objective}
              style={{ width: '200px', height: '20px' }}
            />
            <Text>{progress.toFixed(2)}%</Text>
          </div>
        </div>

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
          {ownedByCurrentAccount && (
            <Button onClick={() => executeMoveCall("reset")}>Reset</Button>
          )}
        </Flex>
      </Flex>
    </>
  );
}

// Utility function to extract campaign fields
function getCampaignFields(data: SuiObjectData) {
  if (data.content?.dataType !== "moveObject") {
    return null;
  }

  return data.content.fields as {
    owner: string;
    objective: string;
    amount: number;
    name: string;
    description: string;
  };
}
