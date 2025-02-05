import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Buttons from "../../../../Components/Buttons/Buttons";
import toast, { Toaster } from "react-hot-toast";
import useAxiosSecure from "../../../../Hooks/Axios secure/useAxiosSecure";
import UserContext from "../../../../Hooks/Context/User_context";
import { useNavigate, useOutletContext } from "react-router-dom";
import spin from'../../../../assets/burgerspin.gif';

const ServeMeals = () => {
  const [search, setSearch] = useState('');
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // To track search status
  const axiosSecure = useAxiosSecure();


  // Fetch all requested meals
  const { data: meals = [], refetch } = useQuery({
    queryKey: ['requested_meals'],
    queryFn: async () => {
      const response = await axios.get(`https://pro12-two.vercel.app/request_meals`, { withCredentials: true });
      return response.data; // The data is directly the meals array
    },
  });

  // Handle filtering based on search term
  useEffect(() => {
    const fetchFilteredMeals = async () => {
      setIsSearching(true);
      try {
        if (!search) {
          setFilteredMeals(meals); // If no search term, show all meals
        } else {
          const response = await axiosSecure.get(`https://pro12-two.vercel.app/review_Search?user=${search}`);
          setFilteredMeals(response.data);
        }
      } catch (error) {
      } finally {
        setIsSearching(false);
      }
    };

    fetchFilteredMeals();
  }, [search, meals, axiosSecure]); // Depend on meals and search

  // Change serving status
  function status_Change(id) {
    axiosSecure
      .patch(`https://pro12-two.vercel.app/change_status/${id}`, { status: "delivered" })
      .then(response => {
        toast.success(response.data.message);
        refetch();
      })
      .catch(err => {
        toast.error(err.response?.data?.message); // Display an error toast
      });
  }

  return (
    <>
      <Toaster />
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">🍽️ Serve Meals</h1>
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table Section */}
        {/* Table Section */}
<div className="overflow-x-auto">
  {isSearching ? (
    <p className="text-center text-gray-500">Searching...</p>
  ) : filteredMeals.length > 0 ? (
    <table className="min-w-full bg-white shadow-md rounded-lg">
      <thead className="bg-gray-200 text-gray-700">
        <tr>
          <th className="py-3 px-4 text-left font-semibold">Meal Title</th>
          <th className="py-3 px-4 text-left font-semibold">User Email</th>
          <th className="py-3 px-4 text-left font-semibold">User Name</th>
          <th className="py-3 px-4 text-left font-semibold">Status</th>
          <th className="py-3 px-4 text-center font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredMeals.map((meal) => (
          <tr key={meal._id} className="hover:bg-gray-100 transition-colors">
            <td className="py-3 px-4">{meal?.title}</td>
            <td className="py-3 px-4">{meal?.email}</td>
            <td className="py-3 px-4">{meal?.username}</td>
            <td className="py-3 px-4">
              <span
                className={`px-2 py-1 rounded-lg text-sm ${
                  meal?.status === "delivered"
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 text-gray-800"
                }`}
              >
                {meal?.status}
              </span>
            </td>
            <td className="py-3 px-4 flex justify-center space-x-2">
              <button
                disabled={meal.status === "delivered"}
                onClick={() => status_Change(meal?._id)}
              >
                <Buttons />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className="text-center text-gray-500">No meals found.</p>
  )}
</div>

      </div>
    </>
  );
};

export default ServeMeals;
