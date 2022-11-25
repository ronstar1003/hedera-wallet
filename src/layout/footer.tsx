import react from "react";
import type { ReactNode, FC } from "react";
import { Box } from "@mui/material";

interface IFooterLayout {
  children: ReactNode;
}

const FooterLayout: FC<IFooterLayout> = ({ children }) => {
  return (
    <Box sx={{ padding: "16px 32px", background: "#252837" }}>{children}</Box>
  );
};

export default FooterLayout;
