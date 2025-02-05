import React, { useState, useEffect, useContext } from "react";
import { DefaultSidebar } from "../../Components/Sidebar/DefaultSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../Hooks/Axios secure/useAxiosSecure";
import UserContext from "../../Hooks/Context/User_context";

const Admin_Dashboard = () => {
  const { User, signout, isLoading } = useContext(UserContext); // Get user context
  const [userData, setUserData] = useState(null); // Store user data
  const [loading, setLoading] = useState(true); // Add loading state
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    if (User?.email) {
      // Fetch user data only if email exists
      axiosSecure
        .get(`https://pro12-two.vercel.app/user_details/${User.email}`)
        .then((response) => {
          setUserData(response.data); // Save fetched user data
          setLoading(false);
          if (response.data.role !== 'admin') {
            signout();

          }
          // Stop loading state
        })
        .catch((error) => {
          setLoading(false); // Stop loading state even if there's an error
          navigate("/login", { replace: true }); // Redirect to login if error fetching user data
        });
    } else {
      // Redirect to login if no user found
      navigate("/login", { replace: true });
    }
  }, [User, axiosSecure, navigate]);

  // useEffect(() => {
  //   if (userData && userData.role !== "admin") {
  //     // Log out the user if their role is not "admin"
  //     signout();
  //     navigate("/login", { replace: true });
  //   }
  // }, [userData, signout, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </header>

      <div className="flex flex-wrap lg:flex-nowrap p-2">
        {/* Sidebar */}
        <DefaultSidebar />

        <div className="w-full p-2">
          {/* Pass userData to child routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin_Dashboard;
