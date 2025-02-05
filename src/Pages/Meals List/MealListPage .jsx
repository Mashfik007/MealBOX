import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import { useQuery } from "@tanstack/react-query";
import spin from "../../assets/burgerspin.gif";
import useAxiosSecure from "../../Hooks/Axios secure/useAxiosSecure";

const MealListPage = () => {
  const axiosSecure = useAxiosSecure();

  // States for search query, price range, and category
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch meals using React Query
  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const response = await axiosSecure.get("https://pro12-two.vercel.app/all_meals");
      return response.data; // The data is directly the meals array
    },
  });

  // Filter meals based on search query, category, and price range
  const filteredMeals = meals.filter((meal) => {
    const matchesSearch = meal.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || meal.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesPrice =
      selectedPrice === "" ||
      (selectedPrice === "under20" && meal.price < 20) ||
      (selectedPrice === "20to60" && meal.price >= 20 && meal.price <= 60) ||
      (selectedPrice === "40to100" && meal.price > 40 && meal.price <= 100);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <>
      {isLoading ? (
        <img src={spin} alt="Loading..." />
      ) : (
        <>
          <Navbar />

          <div className="container mx-auto p-6 md:p-12 bg-gray-50">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Meal List</h1>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <input
                type="text"
                className="p-3 border-2 border-gray-300 rounded-lg w-full md:w-1/3"
                placeholder="Search meals"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <select
                className="p-3 border-2 border-gray-300 rounded-lg w-full md:w-1/5"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="dinner">Dinner</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="snack">Snack</option>
            
              </select>

              <select
                className="p-3 border-2 border-gray-300 rounded-lg w-full md:w-1/5"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
              >
                <option value="">All Price Ranges</option>
                <option value="under20">Under $20</option>
                <option value="20to60">$20 - $60</option>
                <option value="40to100">$40 - $100</option>
              </select>

              <NavLink
                to={"/upcoming_meals"}
                className="bg-base-200 p-2 text-center flex justify-center items-center rounded-lg w-full md:w-1/5"
              >
                Upcoming Meals
              </NavLink>
            </div>

            {/* Meal Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredMeals.map((meal) => (
                <div key={meal._id} className="bg-white p-6 rounded-lg shadow-lg">
                  <img
                    src={meal.image}
                    alt={meal.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <h3 className="text-xl font-semibold mt-4">{meal.title}</h3>
                  <p className="text-gray-500">{meal.category}</p>
                  <p className="text-lg font-bold mt-2">${meal.price}</p>
                  <p className="text-gray-500 mt-2">{meal.ingredients}</p>
                  <NavLink
                    to={`/meal/${meal._id}`}
                    className="text-blue-500 underline mt-4 inline-block"
                  >
                    Details
                  </NavLink>
                </div>
              ))}
            </div>

            {filteredMeals.length === 0 && (
              <p className="text-center text-gray-500 mt-6">
                No meals match your filters.
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default MealListPage;
