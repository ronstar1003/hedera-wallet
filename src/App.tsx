/*global chrome*/
import React from "react";
import { Router } from "react-chrome-extension-router";
import { ThemeProvider } from "@emotion/react";

import { ContextProvider } from "./context";

import SignIn from "./pages/signin";

import theme from "./theme/theme";

import "./App.css";

function App() {
  return (
    <ContextProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <SignIn />
        </Router>
      </ThemeProvider>
    </ContextProvider>
  );
}

export default App;
