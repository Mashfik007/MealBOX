import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import spin from "../assets/burgerspin.gif";
import UserContext from "../Hooks/Context/User_context";
const PRivate_Route = ({ children }) => {
    const {User,loading} = useContext(UserContext);
    const location = useLocation();

    if (loading) {
        return <img src={spin} alt=""  />
    }

    if (User && User.email) {
        return children;
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PRivate_Route;