import {
  Box,
  Typography,
  Button,
  TextField,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState, useContext } from "react";
import axios from "axios";

import ContentWrapper from "../layout/content-wrapper";
import FooterLayout from "../layout/footer";
import PageWrapper from "../layout/page-wrapper";

import { SettingContext } from "../context";
import {
  TransferTransaction,
  Hbar,
  AccountId,
  PrivateKey,
  Client,
} from "@hashgraph/sdk";

import { OPERATOR_ID, OPERATOR_KEY } from "../config";

type IToken = {
  admin_key: {
    _type: string;
    key: string;
  };
  symbol: string;
  token_id: string;
  type: string;
  image: string;
  detail: any;
};

const MainPage = () => {
  const [sendHBAR, setSendHBAR] = useState<string>("");
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const { settings } = useContext(SettingContext);
  const [selValue, setSelValue] = useState<string>();
  const [token, setToken] = useState<IToken[]>();
  const [openConfirm, setConfirmOpen] = useState<boolean>(false);

  const client = Client.forTestnet();
  client.setOperator(OPERATOR_ID, OPERATOR_KEY);

  const handleTabChange = (
    event: React.ChangeEvent<{}>,
    newTabIndex: number
  ) => {
    setTabIndex(newTabIndex);
  };

  const getTokens = async () => {
    const tokens = await axios(
      "https://mainnet-public.mirrornode.hedera.com/api/v1/tokens?type=NON_FUNGIBLE_UNIQUE"
    );

    const res = await Promise.all(
      tokens.data.tokens.map(async (item: any) => {
        const detail = await axios(
          `https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/${item.token_id}`
        );
        if (item.symbol.length > 7 && item.symbol.includes("IPFS://")) {
          const photo = await axios(
            `https://ipfs.io/ipfs/${item.symbol.slice(7)}`
          );

          return { ...item, detail: detail?.data, image: photo.data.photo };
        }
        return { ...item, detail: detail?.data };
      })
    );

    setToken(res);
  };

  useEffect(() => {
    getTokens();
    document.title = "Wallet Nickname | Hashpack";
  }, []);

  return (
    <PageWrapper>
      <Box>
        <Box
          sx={{
            marginBottom: "32px",
            background: "#252837",
            padding: "32px 32px 0",
          }}
        >
          <Box sx={{ marginBottom: "16px" }}>
            <Typography variant="body1" color="textPrimary">
              {settings?.userData?.NicekName}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {settings?.hashconnectData?.topic?.toString() || ""}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="body1"
              color="textPrimary"
              sx={{
                fontWeight: "bolder",
                fontSize: "36px",
                lineHeight: "24px",
              }}
            >
              ---
            </Typography>
            <Typography variant="body1" color="textSecondary">
              USD
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tabs value={tabIndex} onChange={handleTabChange}>
              <Tab label="SEND" />
              <Tab label="NFT" />
            </Tabs>
          </Box>
        </Box>

        <Box sx={{ maxHeight: "400px", overflow: "auto" }}>
          <ContentWrapper>
            {tabIndex === 0 ? (
              <Box>
                <Typography variant="body1" color="textSecondary">
                  Send to
                </Typography>
                <TextField
                  fullWidth
                  value={sendHBAR}
                  onChange={(e) => setSendHBAR(e.target.value)}
                />
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ marginTop: "16px" }}
                >
                  Amount
                </Typography>
                <TextField
                  fullWidth
                  value={amount?.toString()}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                />
              </Box>
            ) : (
              <Box>
                <Typography variant="subtitle1" color="textPrimary">
                  Associate a Token
                </Typography>

                <Typography variant="body1" color="textSecondary">
                  In order to be able to receive a token, you must first
                  associate the Token ID. Network Fee: ~1.01328 HBAR
                </Typography>

                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ marginTop: "16px", marginBottom: "8px" }}
                >
                  Select a popular token
                </Typography>

                {token?.length === 0 ? (
                  <Box>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    sx={{ width: "100%" }}
                    onChange={(e) => {
                      setSelValue(e.target.value);
                    }}
                    value={selValue}
                  >
                    {token?.map((item: any, index: number) => (
                      <MenuItem
                        sx={{ color: "black" }}
                        value={item?.token_id}
                        key={`token_key_${index}`}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: "4px",
                            justifyContent: "space-between",
                            alignItem: "center",
                          }}
                        >
                          <Box>
                            {item?.image && item?.image.length > 30 && (
                              <img
                                width="32px"
                                height="32px"
                                src={`data:image/jpeg;base64,${item?.image}`}
                              />
                            )}
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {`${item?.detail.name} - ${item?.token_id}`}
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                )}

                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  sx={{ marginTop: "16px", marginBottom: "8px" }}
                >
                  Token Info
                </Typography>

                {selValue && (
                  <>
                    <Box
                      sx={{
                        padding: "8px 0",
                        borderBottom: "2px solid #2E314B",
                      }}
                    >
                      <Typography variant="body1" color="textPrimary">
                        Name
                      </Typography>
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{ marginBottom: "8px" }}
                      >
                        {
                          token?.find((item) => item?.token_id === selValue)
                            ?.detail?.name
                        }
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "8px 0",
                        borderBottom: "2px solid #2E314B",
                        overflowWrap: "break-word",
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{ marginBottom: "8px" }}
                      >
                        Symbol
                      </Typography>
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{ marginBottom: "8px" }}
                      >
                        {
                          token?.find((item) => item?.token_id === selValue)
                            ?.symbol
                        }
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "8px 0",
                        borderBottom: "2px solid #2E314B",
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{ marginBottom: "8px" }}
                      >
                        Max Supply
                      </Typography>
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{ marginBottom: "8px" }}
                      >
                        {token?.find((item) => item?.token_id === selValue)
                          ?.detail?.max_supply || "none"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        padding: "8px 0",
                        borderBottom: "2px solid #2E314B",
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{ marginBottom: "8px" }}
                      >
                        Initial Supply
                      </Typography>
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{ marginBottom: "8px" }}
                      >
                        {token?.find((item) => item?.token_id === selValue)
                          ?.detail?.initial_supply || "none"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        padding: "8px 0",
                        borderBottom: "2px solid #2E314B",
                        overflowWrap: "break-word",
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{ marginBottom: "8px" }}
                      >
                        Admin Key
                      </Typography>
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{ marginBottom: "8px" }}
                      >
                        {
                          token?.find((item) => item?.token_id === selValue)
                            ?.detail?.admin_key?.key
                        }
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "8px 0",
                        borderBottom: "2px solid #2E314B",
                        overflowWrap: "break-word",
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{ marginBottom: "8px" }}
                      >
                        Wipe Key
                      </Typography>
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{ marginBottom: "8px" }}
                      >
                        {
                          token?.find((item) => item?.token_id === selValue)
                            ?.detail?.wipe_key?.key
                        }
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        padding: "8px 0",
                        borderBottom: "2px solid #2E314B",
                        overflowWrap: "break-word",
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{ marginBottom: "8px" }}
                      >
                        Freeze Key
                      </Typography>
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{ marginBottom: "8px" }}
                      >
                        {
                          token?.find((item) => item?.token_id === selValue)
                            ?.detail?.freeze_key?.key
                        }
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        padding: "8px 0",
                        borderBottom: "2px solid #2E314B",
                        overflowWrap: "break-word",
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{ marginBottom: "8px" }}
                      >
                        Pause Key
                      </Typography>
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{ marginBottom: "8px" }}
                      >
                        {
                          token?.find((item) => item?.token_id === selValue)
                            ?.detail?.pause_key?.key
                        }
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </ContentWrapper>
        </Box>
      </Box>
      {tabIndex === 0 && (
        <FooterLayout>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              if (amount > 0 && sendHBAR !== "") setOpen(true);
              else alert("set AccountID or HBAR you want to send");
            }}
          >
            Send
          </Button>
        </FooterLayout>
      )}
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
            borderColor: "red",
          },
        }}
      >
        <DialogTitle>
          <Typography
            variant="body1"
            color="textPrimary"
            sx={{ textAlign: "center" }}
          >
            Are you sure?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="textPrimary">
            {`You will send ${amount} HBAR to ${sendHBAR.toString()} from your account`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            sx={{ background: "red" }}
            onClick={async () => {
              await new TransferTransaction()
                .addHbarTransfer(
                  settings?.hashconnectData?.topic?.toString() || "",
                  Hbar.fromTinybars(-amount)
                ) //Sending account
                .addHbarTransfer(
                  AccountId.fromString(sendHBAR),
                  Hbar.fromTinybars(amount)
                ) //Receiving account
                .execute(client);
              setConfirmOpen(true);
              setOpen(false);
            }}
          >
            <Typography variant="body1" color="textPrimary">
              Yes
            </Typography>
          </Button>
          <Button onClick={() => setOpen(false)}>
            <Typography variant="body1" color="textPrimary">
              No
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openConfirm}
        onClose={() => {
          setConfirmOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: "#252836",
            width: "360px",
            borderColor: "red",
          },
        }}
      >
        <DialogTitle>
          <Typography
            variant="body1"
            color="textPrimary"
            sx={{ textAlign: "center" }}
          >
            ALERT
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="textPrimary">
            {`You sent ${amount} HBAR to ${sendHBAR.toString()} from your account`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            sx={{ background: "red" }}
            onClick={() => {
              setConfirmOpen(false);
            }}
          >
            <Typography variant="body1" color="textPrimary">
              Confirm
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
};

export default MainPage;
