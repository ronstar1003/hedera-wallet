import react from "react";
import type { FC, ReactNode } from "react";
import { Box } from "@mui/material";

interface IHeaderLayout {
  children: ReactNode;
}

const HeaderLayout: FC<IHeaderLayout> = ({ children }) => {
  return (
    <Box
      sx={{
        marginBottom: "32px",
        background: "#252837",
        width: "100%",
      }}
    >
      <Box sx={{ padding: "32px" }}>{children}</Box>
    </Box>
  );
};

export default HeaderLayout;
