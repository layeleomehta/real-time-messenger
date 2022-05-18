import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import ToggleColourMode from "./components/ToggleColourMode";
import Views from "./components/Views";
import { AccountContextProvider } from "./components/context/AccountContext";



function App() {
  return (
    <AccountContextProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
          <div className="App">
            <Views/>
            <ToggleColourMode></ToggleColourMode>
          </div>
      </ChakraProvider>
    </AccountContextProvider>
  );
}

export default App;
