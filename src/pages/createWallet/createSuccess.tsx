import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogContent,
  Grid,
} from "@mui/material";
import { goTo } from "react-chrome-extension-router";
import { useEffect, useState, useContext } from "react";

import MainPage from "../main";

import HeaderLayout from "../../layout/header";
import ContentWrapper from "../../layout/content-wrapper";
import FooterLayout from "../../layout/footer";
import PageWrapper from "../../layout/page-wrapper";

import { SettingContext } from "../../context";

const CreateSuccess = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { settings, saveSettings } = useContext(SettingContext);
  const seeds = settings?.userData?.salt?.words;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      settings?.hashconnectData?.topic?.toString() || ""
    );
  };

  useEffect(() => {
    document.title = "Wallet Creation Success | Hashpack";
  }, []);

  return (
    <PageWrapper>
      <Box>
        <HeaderLayout>
          <Typography variant="body1" color="textSecondary">
            Step 4 of 4
          </Typography>
          <Typography variant="subtitle1" color="textPrimary">
            Save Your Information
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Securely store your Account ID along with your 24-Word Seed Phrase
            and Private Key. Don't lose it! You will need this information to
            recover your account.
          </Typography>
        </HeaderLayout>

        <ContentWrapper>
          <Box sx={{ marginBottom: "8px" }}>
            <Typography
              variant="subtitle2"
              color="textPrimary"
              sx={{ marginBottom: "8px", fontWeight: "bold" }}
            >
              Account ID
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ marginBottom: "8px" }}
            >
              This is the address you use to send, receive and pay with HBAR.
            </Typography>
            <Box>
              <TextField
                value={settings?.hashconnectData?.topic?.toString()}
                sx={{
                  color: "white",
                  borderRadius: "5px 0 0 5px",
                  "& .MuiInputBase-input:hover": { background: "#252836" },
                  "& .MuiInputBase-input:focus + fieldset": {
                    border: "none",
                  },
                }}
              />
              <Button
                onClick={handleCopy}
                sx={{
                  borderRadius: "0px 5px 5px 0",
                  height: "38px",
                  color: "white",
                }}
              >
                Copy
              </Button>
            </Box>
          </Box>

          <Typography
            variant="subtitle2"
            color="textPrimary"
            sx={{ marginBottom: "8px", fontWeight: "bold" }}
          >
            Seed Phrase and Private Key
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ marginBottom: "8px" }}
          >
            Never share these with anyone. They are used to recover your
            account. Keep them safe and secure.
          </Typography>
          <Box>
            <Button sx={{ color: "white" }} onClick={() => setOpen(true)}>
              Reveal Recover Keys
            </Button>
          </Box>
        </ContentWrapper>
      </Box>

      <FooterLayout>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => goTo(MainPage)}
          sx={{
            borderColor: "#298846",
            background: "#178337",
            color: "white",
            "&:hover": { borderColor: "#298846" },
          }}
        >
          Let's go!
        </Button>
      </FooterLayout>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: "#252836",
            width: "360px",
          },
        }}
      >
        <DialogContent>
          <Typography
            variant="subtitle2"
            color="textPrimary"
            sx={{ marginBottom: "8px", fontWeight: "bold" }}
          >
            Private Key
          </Typography>
          <Typography
            variant="body1"
            color="textPrimary"
            sx={{ marginBottom: "8px", overflowWrap: "break-word" }}
          >
            {settings?.hashconnectData?.pairingData[0]?.toStringDer()}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => {
              navigator.clipboard.writeText(
                settings?.hashconnectData?.pairingData[0]?.toStringDer()
              );
            }}
            sx={{
              borderColor: "#5d5db1",
              background: "transparent",
              color: "white",
              fontSize: "12px",
              "&:hover": {
                borderColor: "#5d5db1",
              },
            }}
          >
            Copy Private Key to Clipboard
          </Button>
          <Typography
            variant="body1"
            color="textPrimary"
            sx={{ margin: "8px 0" }}
          >
            24-Word Seed Phrase
          </Typography>
          <Grid container spacing={2}>
            {seeds?.map((seed, index) => (
              <Grid item xs={4} key={`${index}_seed_item`}>
                <Box sx={{ display: "flex", gap: "4px" }}>
                  <Box
                    sx={{
                      borderRadius: "100%",
                      background: "#313651",
                      width: "16px",
                      height: "16px",
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "8px",
                      marginTop: "auto",
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ alignItem: "center", lineHeight: "18px" }}
                  >
                    {seed}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};

export default CreateSuccess;
