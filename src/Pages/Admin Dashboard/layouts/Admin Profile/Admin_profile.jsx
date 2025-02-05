import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../../../Hooks/Context/User_context';
import axios from 'axios';

const Admin_profile = () => {
  const { User } = useContext(UserContext);
  const [count, setcount] = useState(null);


useEffect(() => {
  axios.get(`https://pro12-two.vercel.app/meals_with_email/${User.email}`,{withCredentials:true})
  
    .then(response => setcount(response.data.mealCount))
  
}, []);





  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
        <div className="flex flex-col items-center">
          <img
            src={User.photoURL}
            alt="Admin Avatar"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">{User.displayName}</h1>
          <p className="text-lg text-gray-600 mb-4">{User.email}</p>
        </div>
        
        <div className="mt-6 flex justify-center items-center space-x-6 border-t border-gray-200 pt-4">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-800">Total Meals</h2>
            <p className="text-3xl text-blue-600 font-bold">{count}</p>
          </div>
        </div>

        {/* Additional Styling for Responsiveness */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin_profile;
