import { useContext } from "react";
import {Outlet, Navigate} from "react-router-dom"; 
import {AccountContext} from "./context/AccountContext"; 

const useAuth = () => {
    // gets loggedIn state of user object and returns it
    const {user} = useContext(AccountContext); 
    // console.log("This is the user object from context", user); 
    return user && user.loggedIn; 
}

const PrivateRoutes = () => {
    const isAuth = useAuth(); 
    return isAuth ? <Outlet/> : <Navigate to="/" />; 
}

export default PrivateRoutes; 