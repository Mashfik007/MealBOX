import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

// Define tabs
const tabs = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snack" },
];

export default function CustomTabSystem() {
  const [activeTab, setActiveTab] = useState(tabs[0].value); // Default tab
  const [meals, setMeals] = useState([]); // Meals data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch data when activeTab changes
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://pro12-two.vercel.app/all_meals_by_type?type=${activeTab}`
        );
        setMeals(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Failed to fetch meals");
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [activeTab]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex space-x-4 border-b-2 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`px-4 py-2 font-semibold ${activeTab === tab.value
                ? "text-white bg-blue-500 rounded"
                : "text-gray-600"
              }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && meals.length === 0 && <p>No meals available.</p>}
        {!loading && !error && meals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {meals.map((meal, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <img src={meal.image} alt="" />
                <h3 className="text-lg font-bold">{meal.name}</h3>
                <p className="text-sm text-gray-600">{meal.description}</p>
                <p className="text-sm text-gray-600"> Rating:{meal.rating}</p>

                <p className="text-blue-500 font-semibold mt-2">
                  Price: ${meal.price}
                </p>
                <NavLink to={`/meal/${meal._id}`} className="text-blue-500 underline mt-4 inline-block">
                  Details
                </NavLink>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
