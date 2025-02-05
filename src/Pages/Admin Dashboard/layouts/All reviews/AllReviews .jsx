import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { NavLink, useNavigate, useOutletContext } from "react-router-dom";
import useAxiosSecure from "../../../../Hooks/Axios secure/useAxiosSecure";
import UserContext from "../../../../Hooks/Context/User_context";
import burger from "../../../../assets/burgerspin.gif";

const AllReviews = () => {
  const axiosSecure = useAxiosSecure();
  const { User, signout, isLoading } = useContext(UserContext); // Get user context
  // const { userData } = useOutletContext();
  // const navigate = useNavigate();

  // // Sign out if the user is not an admin
  // useEffect(() => {
  //   if (userData && userData.role !== "admin") {
  //     signout(); // Sign the user out if they don't have admin role
  //   }
  // }, [userData, signout]);

  // Show loading spinner until data is fetched
  // if (isLoading) {
  //   return (
  //     <img src={burger} className="w-full" alt="Loading..." />
  //   );
  // }

  // Query to fetch meals
  const { data: meals = [], isError, refetch } = useQuery({
    queryKey: ['all_meals'],
    queryFn: async () => {
      try {
        const response = await axiosSecure.get("https://pro12-two.vercel.app/all_reviews_user");
        return response.data;
      } catch (error) {
        return []; // Return empty array on error
      }
    },
  });

  const Deleted = (id) => {
    axiosSecure
      .delete(`https://pro12-two.vercel.app/review_delete/${id}`)
      .then((response) => {
        toast.success(response.data.message);
        refetch();
      })
      .catch((error) => {
        toast.error("Failed to delete review.");
      });
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <Toaster />
      <div className="flex flex-wrap justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">📋 All Reviews</h1>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto text-lg">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Meal Title</th>
              <th className="py-3 px-4 text-left font-semibold">Likes</th>
              <th className="py-3 px-4 text-left font-semibold">Reviews Count</th>
              <th className="py-3 px-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Check if meals are loaded */}
            {meals && meals.length > 0 ? (
              meals.map((data) => (
                <tr key={data._id} className="hover:bg-gray-100 transition-colors">
                  <td className="py-3 px-4">{data.title}</td>
                  <td className="py-3 px-4">{data.like}</td>
                  <td className="py-3 px-4">{data.review_count}</td>
                  <td className="py-3 px-4 flex justify-center space-x-2">
                    <NavLink
                      to={`/meal/${data.meals_id}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      View Meal
                    </NavLink>
                    <button
                      onClick={() => Deleted(data._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  {isError ? "Error fetching reviews." : "No reviews available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllReviews;
