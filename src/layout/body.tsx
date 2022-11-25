import react from "react";
import type { ReactNode, FC } from "react";
import { Box } from "@mui/material";

interface IBody {
  children: ReactNode;
}

const Body: FC<IBody> = ({ children }) => {
  return <Box sx={{ padding: "0 32px" }}>{children}</Box>;
};

export default Body;
