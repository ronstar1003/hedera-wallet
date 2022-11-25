import react, { useEffect, useState, useMemo, useContext } from "react";
import { Box, Typography, Button, Grid, TextField } from "@mui/material";
import { goTo } from "react-chrome-extension-router";

import CreateWallet from "./createWalletType";
import SetWalletName from "./setWalletName";

import HeaderLayout from "../../layout/header";
import ContentWrapper from "../../layout/content-wrapper";
import FooterLayout from "../../layout/footer";
import PageWrapper from "../../layout/page-wrapper";

import { SettingContext } from "../../context";

const SaveSeeds = () => {
  const [goToVerify, setGoToVerify] = useState<boolean>(false);
  const [verifySuccess, setVerifySuccess] = useState<boolean>(false);
  const [verifyPhrase, setVerifyPhrase] = useState<{
    [key: number]: string | undefined;
  }>({});

  const { settings } = useContext(SettingContext);
  const seeds = settings?.userData?.salt?.words;

  const missingSeeds = useMemo(() => {
    const arr = [];
    while (arr.length < 5) {
      let r = Math.floor(Math.random() * 24);
      while (arr.indexOf(r) !== -1) {
        r = Math.floor(Math.random() * 24);
      }
      arr.push(r);
    }
    return arr;
  }, [seeds]);

  useEffect(() => {
    document.title = "Seed Phrase | Hashpack";
  }, []);

  useEffect(() => {
    let flag = 0;
    seeds?.map((seed, index) => {
      if (missingSeeds.includes(index) && verifyPhrase[index] === seeds[index])
        flag++;
    });

    if (flag === 5) setVerifySuccess(true);
    else setVerifySuccess(false);
  });

  return (
    <PageWrapper>
      {!goToVerify ? (
        <>
          <Box>
            <HeaderLayout>
              <Typography variant="body1" color="textSecondary">
                Step 2 of 4
              </Typography>
              <Typography variant="subtitle1" color="textPrimary">
                Save Your Seed Phrase
              </Typography>
              <Typography variant="body1" color="textSecondary">
                A Seed Phrase allows you to recover your account.{" "}
                <span style={{ color: "white", fontWeight: "bold" }}>
                  Write down the 24-Word Phrase below.
                </span>{" "}
                Keep it in a safe place. We’ll ask you to verify it on the next
                page.
              </Typography>
            </HeaderLayout>

            <ContentWrapper>
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
            </ContentWrapper>
          </Box>

          <FooterLayout>
            <Box sx={{ display: "flex", gap: "16px" }}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => goTo(CreateWallet)}
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
                onClick={() => setGoToVerify(true)}
              >
                Next
              </Button>
            </Box>
          </FooterLayout>
        </>
      ) : (
        <>
          <Box>
            <HeaderLayout>
              <Typography variant="body1" color="textSecondary">
                Step 2 of 4
              </Typography>
              <Typography variant="subtitle1" color="textPrimary">
                Verify Phrase
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Please fill in the missing words.{" "}
                <span style={{ color: "white", fontWeight: "bold" }}>
                  You can't recover your account if you lose your 24-Words
                  Phrase.
                </span>{" "}
                As long as you keep this phrase safe, your wallet will be
                secure.
              </Typography>
            </HeaderLayout>

            <ContentWrapper>
              <Grid container spacing={2}>
                {seeds?.map((seed, index) => (
                  <Grid item xs={4} key={`${index}_seed_item`}>
                    <Box sx={{ display: "flex", gap: "4px" }}>
                      <Box
                        sx={{
                          borderRadius: "100%",
                          background:
                            missingSeeds.includes(index) &&
                            verifyPhrase[index] === seeds[index]
                              ? "#1a8041"
                              : "#313651",
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
                      {missingSeeds.includes(index) ? (
                        <TextField
                          value={verifyPhrase[index] || ""}
                          onChange={(e) =>
                            setVerifyPhrase((prev) => ({
                              ...prev,
                              [index]: e.target.value,
                            }))
                          }
                          sx={{
                            fontSize: "6px",
                            width: "70px",
                            borderRadius: "4px",
                            ".MuiInputBase-input": {
                              padding: "0 2px !important",
                            },
                            ".MuiInputBase-input:focus + fieldset": {
                              borderRadius: "0 !important",
                              border: "none",
                            },
                            ".MuiInputBase-input:hover": {
                              background: "transparent",
                            },
                          }}
                        />
                      ) : (
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{ alignItem: "center", lineHeight: "18px" }}
                        >
                          {seed}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </ContentWrapper>
          </Box>

          <FooterLayout>
            <Box sx={{ display: "flex", gap: "16px" }}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => setGoToVerify(false)}
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
                disabled={!verifySuccess}
                onClick={() => goTo(SetWalletName)}
              >
                Next
              </Button>
            </Box>
          </FooterLayout>
        </>
      )}
    </PageWrapper>
  );
};

export default SaveSeeds;
