import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import ToggleColourMode from "./components/ToggleColourMode";
import {BrowserRouter} from "react-router-dom"; 
import Views from "./components/Views";


function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
          <div className="App">
            <Views/>
            <ToggleColourMode></ToggleColourMode>
          </div>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
