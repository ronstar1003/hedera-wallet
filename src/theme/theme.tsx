import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    text: {
      primary: "#FFFFFF",
      secondary: "#ACACD3",
    },
    action: {
      disabledBackground: "#383761",
      disabled: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: `Montserrat, sans-serif`,
    subtitle1: {
      fontWeight: 600,
      fontSize: "24px",
    },
    body1: {
      fontWeight: 500,
      fontSize: "14px",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderRadius: `8px`,
            },
          },
          background: "#252836",
          borderRadius: `8px`,

          "& .MuiInputBase-input:focus + fieldset": {
            border: `2px solid #ACACD3`,
          },
          "& .MuiInputBase-input + fieldset": {
            border: 0,
          },
          "& .MuiInputBase-input": {
            borderRadius: `8px`,
            padding: "9px 16px !important",
            transition: "all 0.3s ease-in-out",
          },
          "& .MuiInputBase-input:hover": {
            background: "#313541",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",

          background: "#5d5db1",

          "&:hover": {
            background: "#313541",
          },
        },
      },
    },
  },
});

export default theme;
