import React, { createContext, useState } from 'react'; 

export const AccountContext = createContext(); 

export const AccountContextProvider = (props) => {
    const [user, setUser] = useState({loggedIn: false}); 

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