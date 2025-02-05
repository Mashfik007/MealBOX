import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import spin from "../../../../assets/burgerspin.gif";
import toast, { Toaster } from "react-hot-toast";
import { NavLink } from "react-router-dom";
import useAxiosSecure from "../../../../Hooks/Axios secure/useAxiosSecure";
import UserContext from "../../../../Hooks/Context/User_context";

const AllMeals = () => {
  const [mealToUpdate, setMealToUpdate] = useState(null);
  const [sorting, setsorting] = useState(false);
  const [sortedMeals, setSortedMeals] = useState([]);
  const axiosSecure = useAxiosSecure();


  const { data: meals = [], isError, refetch } = useQuery({
    queryKey: ["all_meals"],
    queryFn: async () => {
      const response = await axios.get(`https://pro12-two.vercel.app/all_meals`);
      return response.data;
    },
  });

  const displayedMeals = sorting ? sortedMeals : meals;

  const Deleted = (id) => {
    axiosSecure
      .delete(`https://pro12-two.vercel.app/meal_delete/${id}`)
      .then((response) => {
        toast.success(response.data.message);
        refetch();
      })
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axiosSecure
      .put(`https://pro12-two.vercel.app/update_meal/${mealToUpdate._id}`, mealToUpdate)
      .then((response) => {
        toast.success("Meal updated successfully!");
        refetch();
        document.getElementById("updateMealModal").close();
      })
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMealToUpdate((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const imgbbResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_key}`,
          formData
        );
        const imageUrl = imgbbResponse.data.data.url;
        setMealToUpdate((prevState) => ({
          ...prevState,
          image: imageUrl,
        }));
      } catch (error) {
        toast.error("Error uploading image!");
      }
    }
  };

  const handleSortBy = async (sortCriteria) => {
    try {
      const response = await axiosSecure.get(
        `https://pro12-two.vercel.app/all_meals_sorting?sort=${sortCriteria}`
      );
      setSortedMeals(response.data);
      setsorting(true);
      toast.success(`Meals sorted by ${sortCriteria}!`);
    } catch (error) {
      toast.error(`Failed to sort meals by ${sortCriteria}!`);
    }
  };

  return (
    <>
      <Toaster />
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">🍴 All Meals</h1>
          <div className="flex flex-wrap space-x-5">
            <button
              onClick={() => handleSortBy("likes")}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              Sort by Likes
            </button>
            <button
              onClick={() => handleSortBy("reviews")}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
            >
              Sort by Reviews
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">Meal Title</th>
                <th className="py-3 px-4 text-left font-semibold">Likes</th>
                <th className="py-3 px-4 text-left font-semibold">Reviews Count</th>
                <th className="py-3 px-4 text-left font-semibold">Rating</th>
                <th className="py-3 px-4 text-left font-semibold">Distributor</th>
                <th className="py-3 px-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedMeals.length > 0 ? (
                displayedMeals.map((meal, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition-colors">
                    <td className="py-3 px-4">{meal?.title}</td>
                    <td className="py-3 px-4">{meal?.like}</td>
                    <td className="py-3 px-4">{meal?.review_count}</td>
                    <td className="py-3 px-4">{meal?.rating}</td>
                    <td className="py-3 px-4">{meal?.distributor}</td>
                    <td className="py-3 px-4 flex justify-center space-x-2">
                      <NavLink
                        to={`/meal/${meal._id}`}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                      >
                        View
                      </NavLink>
                      <button
                        className="btn"
                        onClick={() => {
                          setMealToUpdate(meal);
                          document.getElementById("updateMealModal").showModal();
                        }}
                      >
                        Update
                      </button>
                      <button
                        onClick={() => Deleted(meal._id)}
                        className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-3 px-4 text-center">
                    No meals available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Updating Meal */}
      <dialog id="updateMealModal" className="modal">
        <div className="modal-box">
          <h2 className="text-xl font-bold mb-4">Update Meal</h2>
          {mealToUpdate && (
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium">
                  Meal Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={mealToUpdate.title || ""}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={mealToUpdate.category || ""}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="ingredients" className="block text-sm font-medium">
                  Ingredients
                </label>
                <input
                  type="text"
                  name="ingredients"
                  value={mealToUpdate.ingredients || ""}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={mealToUpdate.description || ""}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={mealToUpdate.price || ""}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium">
                  Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                  onClick={() => document.getElementById("updateMealModal").close()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Update
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
};

export default AllMeals;
