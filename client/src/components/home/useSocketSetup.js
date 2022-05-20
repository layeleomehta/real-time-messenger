import React, { useEffect, useContext } from 'react'; 
import socket from '../../socket';
import {AccountContext} from "../context/AccountContext"; 

const useSocketSetup = () => {
    const { setUser } = useContext(AccountContext); 

    useEffect(() => {
        socket.connect(); 
        socket.on("connect_error", () => {
            setUser({loggedIn: false}); 
        })
    
      return () => {
          // we have to remove event listeners from the listeners array (smth that EventEmitter class does)
          socket.off("connect_error"); 
      }
    }, [setUser])
    

}

export default useSocketSetup; 