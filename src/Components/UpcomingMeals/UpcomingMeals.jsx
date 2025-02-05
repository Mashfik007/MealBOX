import React from "react";
import Navbar from "../Navbar/Navbar";
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/Axios secure/useAxiosSecure";

const Upcoming = () => {
  const axiosSecure=useAxiosSecure()

  const { data: meals = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['upcoming_meals'],
    queryFn: async () => {
      const response = await axios.get(`https://pro12-two.vercel.app/upcoming_meals` );
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  const like = (mealId) => {
    
    // Optimistic UI update (no loading indicator)
 
    axiosSecure
      .put(`https://pro12-two.vercel.app/up_coming_meal_increase_like/${mealId}` )
  
  };


  return (
    <>
      <Navbar></Navbar>
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <h1 className="text-3xl font-bold text-center mb-8">Upcoming Meals</h1>

        {/* Meal Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <div key={meal._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={meal.image || "https://via.placeholder.com/150"} // Use dynamic image URL from the API
                alt={meal.title} // Dynamic title for the alt tag
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{meal.title}</h2> {/* Dynamic title */}
                <p className="text-gray-600 mb-4">{meal.description}</p> {/* Dynamic description */}
                <p className="text-gray-600 mb-4">Category: {meal.category}</p> {/* Dynamic category */}
                <p className="text-gray-600 mb-4">Price: ${meal.price}</p> {/* Dynamic price */}
                <div className="flex justify-between items-center">
                  <button onClick={()=>like(meal._id)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Like
                  </button>
                  {/* <span className="text-gray-700 font-medium">Likes: {meal.like}</span> Dynamic likes */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Upcoming;
