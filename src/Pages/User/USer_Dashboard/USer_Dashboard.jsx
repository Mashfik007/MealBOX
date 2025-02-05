import React, { useContext, useEffect, useState } from 'react';
import { DefaultSidebar } from '../../../Components/User_Sidebar/DefaultSidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import UserContext from '../../../Hooks/Context/User_context';
import useAxiosSecure from '../../../Hooks/Axios secure/useAxiosSecure';

const USer_Dashboard = () => {
    const { User } = useContext(UserContext);
    const [UserData, setUserData] = useState(null);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    useEffect(() => {
        if (User && User.email) {
            axiosSecure
                .get(`https://pro12-two.vercel.app/user_details/${User.email}` )
                .then((response) => setUserData(response.data))
        } else {
            navigate("/login", { replace: true }); // Redirect to login if no user
        }
    }, [User, axiosSecure, navigate]);

    if (!UserData) {
        return <div>Loading...</div>; // Loading state for dashboard
    }

    return (
        <div className="flex">
            <DefaultSidebar />
            <div className="w-full">
                {/* Pass user data to child routes using context */}
                <Outlet context={{ UserData }} />
            </div>
        </div>
    );
};

export default USer_Dashboard;
