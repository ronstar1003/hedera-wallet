import { Box, Typography, Button, TextField } from "@mui/material";
import { goTo } from "react-chrome-extension-router";
import { useEffect, useState, useContext } from "react";

import SaveSeeds from "./saveSeeds";
import CreateSuccess from "./createSuccess";

import HeaderLayout from "../../layout/header";
import ContentWrapper from "../../layout/content-wrapper";
import FooterLayout from "../../layout/footer";
import PageWrapper from "../../layout/page-wrapper";

import { SettingContext } from "../../context";

const SetWalletName = () => {
  const [walletName, setWalletName] = useState<string>("");
  const { settings, saveSettings } = useContext(SettingContext);

  useEffect(() => {
    document.title = "Wallet Nickname | Hashpack";
  }, []);

  const handleCreate = () => {
    saveSettings({
      ...settings,
      userData: { ...settings.userData, NicekName: walletName },
    });
    goTo(CreateSuccess);
  };

  return (
    <PageWrapper>
      <Box>
        <HeaderLayout>
          <Typography variant="body1" color="textSecondary">
            Step 3 of 4
          </Typography>
          <Typography variant="subtitle1" color="textPrimary">
            Name Your Account
          </Typography>
          <Typography variant="body1" color="textSecondary">
            You can name your default HashPack account. This is optional, but
            might help you keep track of what the account is for.
          </Typography>
        </HeaderLayout>

        <ContentWrapper>
          <Typography
            variant="subtitle2"
            color="textPrimary"
            sx={{ marginBottom: "8px", fontWeight: "bold" }}
          >
            Your Wallet Nickname
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ marginBottom: "8px" }}
          >
            Alphanumeric characters only.
          </Typography>
          <TextField
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
          />
        </ContentWrapper>
      </Box>

      <FooterLayout>
        <Box sx={{ display: "flex", gap: "16px" }}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => goTo(SaveSeeds)}
            sx={{
              borderColor: "#8c8ccf",
              background: "transparent",
              color: "white",
              "&:hover": { borderColor: "#b4b4c7" },
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreate}
            disabled={!walletName}
          >
            CreateWallet
          </Button>
        </Box>
      </FooterLayout>
    </PageWrapper>
  );
};

export default SetWalletName;
