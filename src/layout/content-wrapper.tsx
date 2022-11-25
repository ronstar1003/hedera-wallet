import react from "react";
import type { ReactNode, FC } from "react";
import { Box } from "@mui/material";

interface IContentWrapper {
  children: ReactNode;
}

const ContentWrapper: FC<IContentWrapper> = ({ children }) => {
  return <Box sx={{ padding: "0 32px" }}>{children}</Box>;
};

export default ContentWrapper;
