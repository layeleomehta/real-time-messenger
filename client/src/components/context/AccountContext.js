import React, { createContext, useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

export const AccountContext = createContext(); 

export const AccountContextProvider = (props) => {
    const [user, setUser] = useState({loggedIn: false}); 
    const navigate = useNavigate(); 

    useEffect(() => {
        const checkSessionExists = async () => {
            try {
                const response = await fetch("http://localhost:4000/auth/login", {
                    credentials: "include"
                }); 

                if(!response || !response.ok || response.status >= 400){
                    setUser({loggedIn: false}); 
                    return; 
                }

                const data = await response.json(); 
                if(!data){
                    setUser({loggedIn: false}); 
                    return; 
                }

                console.log(data)

                setUser({...data}); 
                navigate("/home"); 
                
            } catch (err) {
                setUser({loggedIn: false}); 
                return; 
                
            }
        }

        checkSessionExists(); 
    }, [])
    



    return (
        <AccountContext.Provider
            value={{
                user,
                setUser
            }}
        >
            {props.children}
        </AccountContext.Provider>
    ); 
}