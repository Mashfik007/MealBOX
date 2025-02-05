import React, { useContext, useEffect } from 'react';
import { useForm } from "react-hook-form";
import burger from '../../../../assets/burgerspin.gif'; // Make sure this path is correct
import axios from 'axios';
import UserContext from '../../../../Hooks/Context/User_context';
import toast, { Toaster } from 'react-hot-toast';
import moment from "moment";
import useAxiosSecure from '../../../../Hooks/Axios secure/useAxiosSecure';
import { useNavigate, useOutletContext } from 'react-router-dom';

const Add_meal = () => {
  const { User, signout, isLoading } = useContext(UserContext); // Get user context
  const axiosSecure=useAxiosSecure()
  const { register, handleSubmit, formState: { errors } } = useForm();

 

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("image", data.image[0]);

      // Upload the image
      const imgbbResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_key}`,
        formData
      );
      const imageUrl = imgbbResponse.data.data.url;

      // Extract other form data
      const { title, category, ingredients, description, price } = data;
      // Get current date and time in the desired format
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
        review_count: 0,
        distributor: User.displayName,
        image: imageUrl,
        time: formattedDateTime,
      };

      // Save meal data to the backend
      const response = await axiosSecure.post('https://pro12-two.vercel.app/all_meals', final);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to add meal. Please try again.");
    }
  };

  return (
    <div>
      <Toaster />
      <section className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Add Meal</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("image", { required: "Meal image is required" })}
            type="file"
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}

          <input
            {...register("title", { required: "Meal title is required" })}
            type="text"
            placeholder="Meal Title"
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}

          <select
            {...register("category", { required: "Category is required" })}
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
          >
            <option value="" disabled selected>
              Select a Category
            </option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}

          <textarea
            {...register("ingredients", { required: "Ingredients are required" })}
            placeholder="Ingredients"
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
          ></textarea>
          {errors.ingredients && (
            <p className="text-red-500 text-sm">{errors.ingredients.message}</p>
          )}

          <textarea
            {...register("description", { required: "Description is required" })}
            placeholder="Description"
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}

          <input
            {...register("price", { required: "Price is required" })}
            type="number"
            placeholder="Price"
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Submit
          </button>
        </form>
      </section>
    </div>
  );
};

export default Add_meal;
