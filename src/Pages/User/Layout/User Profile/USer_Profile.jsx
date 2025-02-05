import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import UserContext from "../../../../Hooks/Context/User_context";

const User_Profile = () => {
  const { signout } = useContext(UserContext); // Get the signout function
  const { UserData } = useOutletContext(); // Get UserData from Outlet context
  const [userData, setUserData] = useState(UserData);
  const navigate = useNavigate();

  
  // Check user role and redirect if not authorized
  useEffect(() => {
    if (userData && userData.role !== "user") {
      signout(); // Sign the user out
      navigate("/login", { replace: true }); // Redirect to login page
    }
  }, [userData, signout, navigate]);

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="flex flex-col items-center">
          <img
            src={userData.image || "https://via.placeholder.com/150"}
            alt="User Avatar"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h1 className="text-xl font-semibold text-gray-800 mb-2">{userData.fullName}</h1>
          <p className="text-gray-600 mb-4">{userData.email}</p>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Badges</h2>
          <div className="flex items-center space-x-3">
            {userData.badge === "gold" && (
              <span className="px-3 py-1 bg-yellow-400 text-white rounded-full text-sm">Gold</span>
            )}
            {userData.badge === "silver" && (
              <span className="px-3 py-1 bg-gray-500 text-white rounded-full text-sm">Silver</span>
            )}
            {userData.badge === "bronze" && (
              <span className="px-3 py-1 bg-brown-700 text-white rounded-full text-sm">Bronze</span>
            )}
            {userData.badge === "platinum" && (
              <span className="px-3 py-1 bg-gray-300 text-white rounded-full text-sm">Platinum</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User_Profile;
