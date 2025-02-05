import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios'; // Importing axios
import notification from "../../assets/notification.svg";
import UserContext from '../../Hooks/Context/User_context';
import logo from "../../assets/logo.png";

const Navbar = () => {
  const { User, loading, signout } = useContext(UserContext); // Access User context
  const [userDetails, setUserDetails] = useState(null);

  // Fetch user details when User changes
  useEffect(() => {
    if (User?.email) {
      axios
        .get(`https://pro12-two.vercel.app/user_details/${User.email}`)
        .then((res) => {
          setUserDetails(res.data); // Store user details in state
        })
        .catch((error) => {
        });
    } else {
      setUserDetails(null); // Clear user details if User is null
    }
  }, [User]);

  // Handle logout
  const handleLogout = () => {
    signout(); // Call signout function
    setUserDetails(null); // Clear user details
  };

  return (
    <div>
      {userDetails ? (
        <>
          {/* Dropdown for Logged-in User */}
          <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-10"
              />
              <span className="text-2xl font-bold">MealSite</span>
              <div className="space-x-4 hidden md:flex">
                <NavLink to={'/'}>Home</NavLink>

                {userDetails.role === 'admin' && (
                  <NavLink to={'/admin_dashboard'}>Admin Dashboard</NavLink>
                )}
                {userDetails.role === 'user' && (
                  <>
                    <NavLink to={'/user_dashboard'}>User Dashboard</NavLink>
                    <NavLink to={'/meals'}>Meals</NavLink>
                  </>
                )}
                <img src={notification} alt="Notifications" />
              </div>
            </div>

            {/* Profile Icon */}
            <div className="flex items-center justify-center space-x-4 h-20">
              <div tabIndex={0} className="collapse flex flex-col items-center justify-center w-10 border-2 border-deep-orange-300">
                <h1>👇</h1>
                <img
                  src={userDetails.image}
                  alt="Profile"
                  className="h-10 w-10 rounded-full cursor-pointer"
                />
                <div className="collapse-content">
                  <p>{userDetails.fullName}</p>
                </div>
              </div>

              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </div>
          </nav>
        </>
      ) : (
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/50"
              alt="Logo"
              className="h-10 w-10"
            />
            <span className="text-2xl font-bold">MealSite</span>
            <div className="space-x-4 hidden md:flex">
              <NavLink to={'/'}>Home</NavLink>
              <NavLink to={'/meals'}>Meals</NavLink>
              <NavLink to={'/upcoming_meals'}>Up Coming Meals</NavLink>
              <img src={notification} alt="Notifications" />
            </div>
          </div>

          {/* Profile Icon */}
          <div className="flex items-center space-x-4">
            <NavLink to={"/login"}>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Join Us
              </button>
            </NavLink>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
