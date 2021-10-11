import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Router } from "./components/Navigation/Router";
import { AppProvider } from "./contexts/AppContext";

const colors = {
  brand: {},
};

const theme = extendTheme({ colors });

function App() {
  return (
    <AppProvider>
      <ChakraProvider resetCSS theme={theme}>
        <Router />
      </ChakraProvider>
    </AppProvider>
  );
}

export default App;
