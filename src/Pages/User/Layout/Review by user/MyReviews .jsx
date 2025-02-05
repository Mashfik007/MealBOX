import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UserContext from "../../../../Hooks/Context/User_context";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { NavLink, useNavigate, useOutletContext } from "react-router-dom";
import useAxiosSecure from "../../../../Hooks/Axios secure/useAxiosSecure";

const MyReviews = () => {
  const [currentReview, setCurrentReview] = useState(null); // For storing the current review to edit
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure=useAxiosSecure()
  const { User, signout } = useContext(UserContext); // Get user context
  const { UserData } = useOutletContext();
  const navigate = useNavigate();


  useEffect(() => {
    if (UserData && UserData.role !== "user") {
      signout(); // Sign the user out
      navigate("/login", { replace: true }); // Redirect to login page
    }
  }, [UserData, signout, navigate]);

  // TODO: Fetch all reviews for the logged-in user
  const { data: reviews = [], isLoading, refetch, isError } = useQuery({
    queryKey: [`review_email/${User?.email}`],
    queryFn: async () => {
      const response = await axiosSecure.get(`https://pro12-two.vercel.app/review_email/${User.email}` );
      return response.data;
    },
    enabled: !!User?.email,
  });

  









  

  
  // TODO: Submit updated review to the server
  const onSubmit = (data) => {
    axiosSecure
      .put(`https://pro12-two.vercel.app/change_review/${currentReview._id}` , data)
      .then(() => {
        toast.success("Review updated successfully!");
        reset(); // Reset form
        setCurrentReview(null);
        refetch() // Close the modal
      })
      .catch((error) => {
        toast.error("Failed to update the review.");
      });
  };

  // TODO: Delete a review by ID
  const Deleted = (id) => {
    axiosSecure
      .delete(`https://pro12-two.vercel.app/review_delete/${id}` )
      .then((response) => {
        toast.success(response.data.message);
        refetch()
      })
  };

  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster />
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Reviews</h2>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Meal Title</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Likes</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Review</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr className="border-b hover:bg-gray-50" key={review._id}>
                <td className="py-3 px-6 text-sm text-gray-800">{review.title}</td>
                <td className="py-3 px-6 text-sm text-gray-600">{review.like}</td>
                <td className="py-3 px-6 text-sm text-gray-600">{review.review}</td>
                <td className="py-3 px-6 text-sm space-x-3">
                  <label
                    htmlFor="my_modal_7"
                    className="btn"
                    onClick={() => setCurrentReview(review)}
                  >
                    Change review
                  </label>

                  <button onClick={() => Deleted(review._id)} className="btn btn-error">
                    Delete
                  </button>

                  <NavLink
                    to={`/meal/${review.meals_id}`}
                    className="btn btn-outline btn-success"
                  >
                    View Meal
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold mb-4">Edit Review</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <textarea
                {...register("review", { required: true })}
                className="textarea textarea-bordered w-full resize-none"
                placeholder="Edit your review here..."
              />
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <label htmlFor="my_modal_7" className="btn">
                Cancel
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyReviews;
