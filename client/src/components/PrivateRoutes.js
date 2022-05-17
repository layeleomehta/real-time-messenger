import {Outlet, Navigate} from "react-router-dom"; 

const useAuth = () => {
    // gets loggedIn state of user object and returns it
    const user = {loggedIn: false}
    return user && user.loggedIn; 
}

const PrivateRoutes = () => {
    const isAuth = useAuth(); 
    return isAuth ? <Outlet/> : <Navigate to="/" />; 
}

export default PrivateRoutes; 