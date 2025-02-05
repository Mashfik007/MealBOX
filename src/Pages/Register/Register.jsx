import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import User_context from "../../Hooks/Context/User_context";
import useAxiosSecure from "../../Hooks/Axios secure/useAxiosSecure";

const Register = () => {
  const axiosSecure=useAxiosSecure()

  const [file, setFile] = useState(null);
 const {Create_User}=useContext(User_context)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password, fullName } = data;
     
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        // Upload image to ImgBB
        const imgbbResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_key}`,
          formData
        );

        const imageUrl = imgbbResponse.data.data.url;

        // Form payload with image URL
        const payload = {
          email,
          password,
          fullName,
          image: imageUrl,
          role:'user',
          badge:"bronze"
        };
       
        
        // Send user data to the backend
        try {
          const response = await axiosSecure.post(`https://pro12-two.vercel.app/all_user`,  payload);
          toast.success(response.data.message);
       
          Create_User(payload)

        } catch (error) {
          toast.error(error.response.data.message); // Handle duplicate user error
        }
      } catch (err) {
        
        toast.error("Image upload failed. Please try again.");
      }
    } else {
      toast.error("Please select an image.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center px-4">
      <Toaster />
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Create an Account</h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-gray-600 mb-1">Photo</label>
            <input
              {...register("photo", { required: "Photo is required" })}
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-3 border rounded-lg focus:outline-none"
            />
            {errors.photo && <p className="text-red-500 text-sm">{errors.photo.message}</p>}
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Full Name</label>
            <input
              {...register("fullName", { required: "Full name is required" })}
              type="text"
              placeholder="Enter your full name"
              className="w-full p-3 border rounded-lg focus:outline-none"
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 border rounded-lg focus:outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="bg-yellow-100 text-yellow-700 p-2 rounded text-sm mt-2">
            New users are automatically assigned a <strong>Bronze Badge</strong>.
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
