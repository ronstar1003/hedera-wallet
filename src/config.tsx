import { PrivateKey, AccountId } from "@hashgraph/sdk";

const OPERATOR_ID = AccountId.fromString(
  process.env.REACT_APP_OPERATOR_ACCOUNT_ID || ""
);
const OPERATOR_KEY = PrivateKey.fromString(
  process.env.REACT_APP_OPERATOR_PRIVATE_KEY || ""
);

export { OPERATOR_ID, OPERATOR_KEY };
