import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import ToggleColourMode from "./components/ToggleColourMode";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
    <div className="App">
      <ToggleColourMode></ToggleColourMode>
    </div>
    </ChakraProvider>
  );
}

export default App;
