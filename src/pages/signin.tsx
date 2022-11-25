import React from "react";
import { goTo } from "react-chrome-extension-router";
import { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { SettingContext, initialSettings } from "../context";

import Logo from "../assets/icons/logo.svg";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import MainPage from "./main";
import CreateWalletType from "./createWallet/createWalletType";

function SignIn() {
  const [isNextButtonDisabled, setIsNextButtonDisabled] =
    useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const { settings, saveSettings } = useContext(SettingContext);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm: "",
      check: false,
    },
    validationSchema: Yup.object({
      password: Yup.string().min(12),
      confirm: Yup.string().min(12),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      saveSettings({ ...settings, userKeyInfo: values.password });
      goTo(CreateWalletType);
    },
  });

  const formik_signIn = useFormik({
    initialValues: {
      password: "",
    },
    onSubmit: async (values, helpers): Promise<void> => {
      if (settings.userKeyInfo === values.password) {
        goTo(MainPage);
      }
    },
  });

  useEffect(() => {
    if (
      formik.values.password === formik.values.confirm &&
      formik.values.check &&
      formik.values.confirm.length >= 12
    ) {
      setIsNextButtonDisabled(false);
    } else setIsNextButtonDisabled(true);
  }, [formik.values.password, formik.values.check, formik.values.confirm]);

  useEffect(() => {
    document.title = "Create Account | Hashpack";
  }, []);

  return (
    <Container sx={{ width: "320px" }}>
      <Box
        sx={{
          paddingBottom: "32px",
          textAlign: "center",
          paddingTop: !settings.userKeyInfo ? "16px" : "50%",
        }}
      >
        <Box component="img" alt="HashPack Image" src={Logo} />
        <Typography variant="subtitle1" color="textPrimary">
          HashPack
        </Typography>
        <Typography variant="body1" color="textSecondary">
          An HBAR crypto wallet built on the most sustainable public network.
        </Typography>
      </Box>
      {!settings.userKeyInfo ? (
        <>
          <Box sx={{ paddingBottom: "16px" }}>
            <Typography variant="body1" color="textPrimary">
              Create a Main Password
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Your password is only stored on this device for security purposes
              and cannot be recovered.
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Must contain a minimum of 12 characters.
            </Typography>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ marginBottom: "16px" }}>
              <TextField
                fullWidth
                placeholder="Password"
                required
                name="password"
                type="password"
                onChange={formik.handleChange}
                autoComplete="off"
              />
              {formik.values.password.length < 12 &&
                formik.values.password.length > 0 && (
                  <FormHelperText error sx={{ marginTop: "8px" }}>
                    Password too short
                  </FormHelperText>
                )}
            </Box>
            <Box sx={{ marginBottom: "16px" }}>
              <TextField
                fullWidth
                type="password"
                required
                name="confirm"
                placeholder="Confirm Password"
                autoComplete="off"
                onChange={formik.handleChange}
              />
              {formik.values.password !== formik.values.confirm &&
                formik.values.confirm.length > 0 && (
                  <FormHelperText error sx={{ marginTop: "8px" }}>
                    Passwords do not match
                  </FormHelperText>
                )}
            </Box>

            <Box sx={{ display: "flex", paddingBottom: "16px" }}>
              <Box sx={{ alignItem: "start" }}>
                <Checkbox
                  size="medium"
                  name="check"
                  onChange={formik.handleChange}
                  sx={{
                    color: "#ACACD3",
                    "& .MuiSvgIcon-root": { fontSize: 28 },
                    "&.Mui-checked": {
                      color: "#ACACD3",
                    },
                  }}
                />
              </Box>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ paddingTop: "10px" }}
              >
                I agree to the{" "}
                <a href="https://www.hashpack.app/terms" target="_blank">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="https://www.hashpack.app/privacy" target="_blank">
                  Privacy Policy
                </a>
              </Typography>
            </Box>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              disabled={isNextButtonDisabled}
              sx={{ marginBottom: "16px" }}
            >
              Next
            </Button>
          </form>
        </>
      ) : (
        <>
          <form onSubmit={formik_signIn.handleSubmit}>
            <Box sx={{ marginBottom: "16px" }}>
              <TextField
                fullWidth
                placeholder="Password"
                required
                name="password"
                type="password"
                onChange={formik_signIn.handleChange}
                autoComplete="off"
              />
            </Box>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginBottom: "16px" }}
            >
              Sign in to Hashpack
            </Button>
            <Typography
              variant="body1"
              color="textPrimary"
              sx={{
                textAlign: "center",
                cursor: "pointer",
                "&:hover": { color: "#5d5db1" },
                paddingBottom: "16px",
              }}
              onClick={() => setOpen(true)}
            >
              Forgot Password
            </Typography>
          </form>
        </>
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
            This will reset all your data. You can reimport your wallets using
            your private key or seed phrase.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            sx={{ background: "red" }}
            onClick={() => {
              saveSettings(initialSettings);
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
    </Container>
  );
}

export default SignIn;
