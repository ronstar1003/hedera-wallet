import react from "react";
import type { ReactNode, FC } from "react";
import { Container } from "@mui/material";

interface IPageWrapper {
  children: ReactNode;
}

const PageWrapper: FC<IPageWrapper> = ({ children }) => {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        height: "100vh",
        padding: "0 !important",
      }}
    >
      {children}
    </Container>
  );
};

export default PageWrapper;
