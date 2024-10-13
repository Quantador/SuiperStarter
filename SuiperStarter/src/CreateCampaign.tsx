import { Transaction } from "@mysten/sui/transactions";
import { Button, Container } from "@radix-ui/themes";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
import { bcs } from '@mysten/sui/bcs';


export function CreateCampaign({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {

  const [name, setName] = useState<string>("");
  const [goal, setGoal] = useState<number>(0);
  const [description, setDescription] = useState<string>("");



  const campaignPackageId = useNetworkVariable("campaignPackageId");
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Raw effects are required so the effects can be reported back to the wallet
          showRawEffects: true,
          showEffects: true,
        },
      }),
  });

  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  }
  const handleChangeGoal = (event) => {
    setGoal(event.target.value);
  }
  const handleChangeName = (event) => {
    setName(event.target.value);
  }

  return (
    <Container>
      <form>
        <label>
          Campaign Name:
          <input type="text" name="name" onChange={handleChangeName} />
        </label>
        <label>
          Goal:
          <input type="number" name="goal" onChange={handleChangeGoal} />
        </label>
        <label>
          Description:
          <input type="text" name="description" onChange={handleChangeDescription} />
        </label>
      </form>
      <Button
        size="3"
        onClick={() => {
          create();
        }}
      >
        Create Campaign
      </Button>
    </Container>
  );

  function stringToUtf8Bytes(str: string): Uint8Array {
    return new TextEncoder().encode(str);
  }

  function create() {
    const tx = new Transaction();
    const nameBytes = stringToUtf8Bytes(name);
    const serializedName = tx.pure(bcs.vector(bcs.U8).serialize(nameBytes));
    const descriptionBytes = stringToUtf8Bytes(description);
    const serializedDescription = tx.pure(bcs.vector(bcs.U8).serialize(descriptionBytes));
    tx.moveCall({
      arguments: [serializedName,serializedDescription,tx.pure.u64(goal)],
      target: `${campaignPackageId}::campaign::create`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          const objectId = result.effects?.created?.[0]?.reference?.objectId;
          if (objectId) {
            onCreated(objectId);
            console.log("Campaign created with id", objectId);
            window.location.reload(); 
          }
        },
        onError: (error) => {
          console.error("Error creating campaign", error);
        }
      },
    );
  }
}
