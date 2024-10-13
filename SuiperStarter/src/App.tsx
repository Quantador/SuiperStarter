import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Box, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { useState } from "react";
import { Campaign } from "./Campaign";
import { CreateCampaign } from "./CreateCampaign";

function App() {
  const currentAccount = useCurrentAccount();
  const [campaignId, setCampaign] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="center"
        align="center"
        gap="4"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>SuiperStart</Heading>
          <Text>A transparent and secure crowdfunding platform, empowering users to support causes with confidence on the SUI blockchain.</Text>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          {currentAccount ? (
            campaignId ? (
              <Campaign id={campaignId} />
            ) : (
              <CreateCampaign
                onCreated={(id) => {
                  window.location.hash = id;
                  setCampaign(id);
                }}
              />
            )
          ) : (
            <Heading>Please connect your wallet</Heading>
          )}
        </Container>
      </Container>
    </>
  );
}

export default App;
