import { Box, Typography, Button } from "@mui/material";
import { goTo } from "react-chrome-extension-router";
import { useEffect, useContext } from "react";

import SignIn from "../signin";
import SaveSeeds from "./saveSeeds";

import HeaderLayout from "../../layout/header";
import ContentWrapper from "../../layout/content-wrapper";
import FooterLayout from "../../layout/footer";
import PageWrapper from "../../layout/page-wrapper";

import { SettingContext } from "../../context";
import { OPERATOR_ID, OPERATOR_KEY } from "../../config";

import {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountId,
  Hbar,
  Mnemonic,
} from "@hashgraph/sdk";

const CreateWalletType = () => {
  const { settings, saveSettings } = useContext(SettingContext);

  useEffect(() => {
    document.title = "Create Type | Hashpack";
  }, []);

  const handleCreate = async () => {
    const mnemonic = await Mnemonic.generate();
    const newAccountPrivateKey = await PrivateKey.fromMnemonic(mnemonic);
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    const client = Client.forTestnet();

    client.setOperator(OPERATOR_ID, OPERATOR_KEY);

    const transaction = new AccountCreateTransaction()
      .setKey(OPERATOR_KEY.publicKey)
      .setInitialBalance(Hbar.fromTinybars(1000));

    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const newAccountId = receipt.accountId;

    saveSettings({
      ...settings,
      hashconnectData: {
        ...settings.hashconnectData,
        pairingData: [newAccountPrivateKey, newAccountPublicKey],
        topic: newAccountId,
      },
      userData: {
        ...settings.userData,
        salt: { words: mnemonic._mnemonic.words },
      },
    });

    goTo(SaveSeeds);
  };

  return (
    <PageWrapper>
      <Box>
        <HeaderLayout>
          <Typography variant="body1" color="textSecondary">
            Step 1 of 4
          </Typography>
          <Typography variant="subtitle1" color="textPrimary">
            Create New Wallet
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Choose how you would like to import your Hedera account, or create a
            new wallet
          </Typography>
        </HeaderLayout>

        <ContentWrapper>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreate}
          >
            Create a new wallet
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: "16px" }}
          >
            New wallet using Ledger
          </Button>
        </ContentWrapper>
      </Box>

      <FooterLayout>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => goTo(SignIn)}
          sx={{
            borderColor: "#8c8ccf",
            background: "transparent",
            color: "white",
            "&:hover": { borderColor: "#b4b4c7" },
          }}
        >
          Back
        </Button>
      </FooterLayout>
    </PageWrapper>
  );
};

export default CreateWalletType;
