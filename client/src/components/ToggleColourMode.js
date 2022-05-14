
import { Button, useColorMode } from '@chakra-ui/react';
import {SunIcon, MoonIcon} from "@chakra-ui/icons"

import React from 'react'

const ToggleColourMode = () => {
    const {colorMode, toggleColorMode} = useColorMode();  
  return (
    <div>
        <Button
            onClick={toggleColorMode}
            pos="absolute"
            top="0" 
            right="0"
            margin="1rem"
            >
            Toggle {colorMode === "light" ? "Dark" : "Light"} Mode {colorMode === "light" ? <MoonIcon paddingLeft="1" color="blue.600"/> : <SunIcon paddingLeft="1" color="orange.500"/>}
        </Button>
    </div>
  )
}

export default ToggleColourMode; 