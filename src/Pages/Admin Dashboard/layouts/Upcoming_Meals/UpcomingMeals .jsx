import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";
import UserContext from "../../../../Hooks/Context/User_context";
import { useQuery } from "@tanstack/react-query";
import Buttons from "../../../../Components/Buttons/Buttons";
import useAxiosSecure from "../../../../Hooks/Axios secure/useAxiosSecure";
import { useNavigate, useOutletContext } from "react-router-dom";

const UpcomingMeals = () => {
  const [showModal, setShowModal] = useState(false);
  const axiosSecure=useAxiosSecure()
  const { User, signout,isLoading  } = useContext(UserContext); // Get user context
 

  // Function to toggle modal
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const { register, handleSubmit, formState: { errors } } = useForm();
  // TODO: GET ALL THE UP COMING MEALS
  const { data: meals = [],isError, refetch } = useQuery({
    queryKey: ['upcoming_meals'],
    queryFn: async () => {
      const response = await axiosSecure.get(`https://pro12-two.vercel.app/upcoming_meals` );
      return response.data; // The data is directly the meals array
    },
  });




  const onSubmit = async (data) => {


    try {
      const formData = new FormData();
      formData.append("image", data.image[0]);

      // TODO: Upload the image
      const imgbbResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_key}`,
        formData
      );
      const imageUrl = imgbbResponse.data.data.url;

      // Extract other form data
      const { title, category, ingredients, description, price } = data;

      const final = {
        email: User.email,
        title,
        category,
        ingredients,
        description,
        price: parseInt(price),
        like: 0,
        rating: 0,
        review: 0,
        distributor: User.displayName,
        image: imageUrl,
      };

      //TODO: Save u coming_meal data to the backend
      const response = await axios.post("https://pro12-two.vercel.app/upcoming_meals" , final);
      toast.success(response.data.message);
      refetch()
    } catch (error) {
    }
  };


       // TODO: SERVE THE MEAL IN ALL MEAL
       function serve(meal) {
       
        const { title, category, ingredients, description, price,image,_id } = meal;
         const formattedDateTime = moment().format("MMMM D, h:mm A");
         
        const final = {
          email: User.email,
          title,
          category,
          ingredients,
          description,
          price: parseInt(price),
          like: 0,
          rating: 0,
          review: 0,
          review_count:0,
          distributor: User.displayName,
          image,
          time:formattedDateTime,
        };

        const response = axios.post('https://pro12-two.vercel.app/all_meals' , final);
        refetch()



  }

  return (
    <div className="container mx-auto p-6">
      <Toaster></Toaster>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">🍴 Upcoming Meals</h1>
        <button
          onClick={toggleModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add Upcoming Meal
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Meal Title</th>
              <th className="py-3 px-4 text-left font-semibold">Likes Count</th>
              <th className="py-3 px-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal._id} className="hover:bg-gray-100 transition-colors">
                <td className="py-3 px-4">{meal.title}</td>
                <td className="py-3 px-4">{meal.like}</td>
                <td className="py-3 px-4 flex justify-center">
                  <button onClick={() => serve(meal)}>
                    <Buttons></Buttons>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Section */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <Toaster />
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add Upcoming Meal</h2>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Meal Title</label>
                <input
                  {...register("title", { required: "Meal title is required" })}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter meal title"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  {...register("category", { required: "Category is required" })}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter category"
                />
                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                <textarea
                  {...register("ingredients", { required: "Ingredients are required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter ingredients"
                ></textarea>
                {errors.ingredients && <p className="text-red-500 text-sm">{errors.ingredients.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter description"
                ></textarea>
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  {...register("price", { required: "Price is required" })}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter price"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  {...register("image", { required: "Image is required" })}
                  type="file"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Add Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingMeals;
