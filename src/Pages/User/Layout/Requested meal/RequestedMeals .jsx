import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect } from "react";
import axios from "axios";
import UserContext from "../../../../Hooks/Context/User_context";
import toast, { Toaster } from "react-hot-toast";
import useAxiosSecure from "../../../../Hooks/Axios secure/useAxiosSecure";
import { useNavigate, useOutletContext } from "react-router-dom";

const RequestedMeals = () => {
  const axiosSecure = useAxiosSecure()
  const { User, signout } = useContext(UserContext); // Get user context
  const { UserData } = useOutletContext();
  const navigate = useNavigate();


  useEffect(() => {
    if (UserData && UserData.role !== "user") {
      signout(); // Sign the user out
      navigate("/login", { replace: true }); // Redirect to login page
    }
  }, [UserData, signout, navigate]);











  const { data: reviews = [], isLoading, isError, refetch } = useQuery({
    queryKey: [`requested_meals/${User?.email}`],
    queryFn: async () => {
      try {
        const response = await axiosSecure.get(`https://pro12-two.vercel.app/requested_meals/${User.email}` );
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        throw new Error("Failed to fetch requested meals");
      }
    },
    enabled: !!User?.email, // Only fetch if User.email exists
  });

  const cancelRequest = (mealId) => {

    axiosSecure
      .delete(`https://pro12-two.vercel.app/request_delete/${mealId}` )
      .then((response) => {
        toast.success(response.data.message);
        refetch(); // Refetch after canceling
      })
      .catch((error) => {
        toast.error("Failed to cancel the request.");
      });
  };






  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Requested Meals</h2>
      {isLoading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b font-semibold text-left">Meal Title</th>
              <th className="py-2 px-4 border-b font-semibold text-left">Likes</th>
              <th className="py-2 px-4 border-b font-semibold text-left">Reviews Count</th>
              <th className="py-2 px-4 border-b font-semibold text-left">Status</th>
              <th className="py-2 px-4 border-b font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((meal, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{meal.title}</td>
                  <td className="py-2 px-4 border-b">{meal.like}</td>
                  <td className="py-2 px-4 border-b">{meal?.review_count}</td>
                  <td className="py-2 px-4 border-b">{meal.status}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      disabled={meal.status.toLowerCase() === "delivered"}
                      aria-disabled={meal.status.toLowerCase() === "delivered"}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                      onClick={() => cancelRequest(meal._id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-2 px-4 text-center">
                  No requested meals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RequestedMeals;
