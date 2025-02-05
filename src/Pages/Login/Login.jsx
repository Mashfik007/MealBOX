import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import User_context from "../../Hooks/Context/User_context";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const { Login, User } = useContext(User_context); // Access User context
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // Default to '/' if no 'from' is provided
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await Login(data); // Trigger your login logic
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  // Redirect if the user is logged in
  useEffect(() => {
    if (User && User.email) {
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    }
  }, [User, navigate, from]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center px-4">
      <Toaster />
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Login to Your Account</h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
