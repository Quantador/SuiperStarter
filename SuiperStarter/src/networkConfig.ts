import { getFullnodeUrl } from "@mysten/sui/client";
import {
  DEVNET_CAMPAIGN_PACKAGE_ID,
  TESTNET_CAMPAIGN_PACKAGE_ID,
  MAINNET_CAMPAIGN_PACKAGE_ID,
} from "./constants.ts";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        campaignPackageId: DEVNET_CAMPAIGN_PACKAGE_ID,
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        campaignPackageId: TESTNET_CAMPAIGN_PACKAGE_ID,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        campaignPackageId: MAINNET_CAMPAIGN_PACKAGE_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
