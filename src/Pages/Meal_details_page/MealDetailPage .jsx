import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import UserContext from "../../Hooks/Context/User_context";
import Navbar from "../../Components/Navbar/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/Axios secure/useAxiosSecure";

const getRandomColor = () => {
  const colors = [
    "bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50",
    "bg-gradient-to-r from-green-200 via-green-100 to-green-50",
    "bg-gradient-to-r from-purple-200 via-purple-100 to-purple-50",
    "bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-50",
    "bg-gradient-to-r from-pink-200 via-pink-100 to-pink-50",
    "bg-gradient-to-r from-red-200 via-red-100 to-red-50",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const MealDetailPage = () => {
  const [user, setuser] = useState();
  const [data, setData] = useState(null);
  const { id } = useParams();
  const { User } = useContext(UserContext);
 const location=useLocation()
 const axiosSecure=useAxiosSecure()
 


  //  TODO: GET MEAL DETAILS
  useEffect(() => {
    // Fetch data once on component mount
    axios
      .get(`https://pro12-two.vercel.app/meal_details/${id}`)
      .then(response => {
        setData(response.data);
      })
  }, [id]);



  // TODO: GIEVE LIKE API
  const like = (mealId) => {
    // Optimistic UI update (no loading indicator)
    setData((prevData) => ({
      ...prevData,
      rating: prevData.rating + 1, // Assuming liking the meal increases the rating
    }));

    axiosSecure
      .put(`https://pro12-two.vercel.app/increase_like/${mealId}`)

  };
  // TODO: REQUEST FOR MEAL
  function request() {
    const {
      category,
      description,
      distributor,
      email,
      image,
      ingredients,
      like,
      price,
      rating,
      review,
      title,
      _id,
    } = data;

    const requestPayload = {
      category,
      description,
      distributor,
      username: User.displayName,
      email: User.email, // Assuming `User` is from your context
      image,
      ingredients,
      like,
      price,
      rating,
      review,
      review_count: data.review_count,
      title,
      status: "pending",
      _id
    };

    axiosSecure
      .post(`https://pro12-two.vercel.app/request_meals` , requestPayload)
      .then((response) => {
        toast.success(response.data.message || "Meal successfully requested!");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  // TODO: Review submit
  const reviewInputRef = useRef(); // Create a ref for the input
  const handleSubmit = () => {
    const review = reviewInputRef.current.value.trim(); // Get the value from the input
    if (review === "") {
      toast.error("Review is empty!"); // Handle empty input
      return;
    }


    const { like, title, _id } = data;

    const final = {
      title,
      meals_id: _id,
      review,
      email: User.email,
    };

    axiosSecure.post('https://pro12-two.vercel.app/all_reviews' , final)
      .then((response) => {
        // Use a specific property from response.data
        if (response.data.message) {
          toast.success(response.data.message);
          refetch()
        } else {
          toast.success("Review submitted successfully!");
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error submitting review");
      });

    reviewInputRef.current.value = ""; // Clear the input
  };



  // TODO:  GET ALL THE REVIEWS BY MEAL ID
  const { data: reviews = [], isLoading, isError, refetch } = useQuery({
    queryKey: data?._id ? [`all_reviews/${data._id}`] : [], // Query key only set when data._id exists
    queryFn: async () => {
      if (!data?._id) return []; // Prevent the query from running if data._id is not ready
      const response = await axios.get(`https://pro12-two.vercel.app/all_reviews?meal_ID=${data._id}`);
      return response.data;
    },
    enabled: !!data?._id, // Ensure the query only runs when data._id is available
  });


  // TODO: GET USER DATA BY EMAIL
  useEffect(() => {
    if (User && User.email) {
      axiosSecure.get(`https://pro12-two.vercel.app/user_details/${User.email}` )
        .then(response => setuser(response.data))
    }
  }, [User]); // Add User as a dependency







  if (!data) {
    return null; // Immediately return nothing if data is still loading
  }

  return (
    <><Toaster></Toaster>
      <Navbar />
      <div key={data._id} className="container mx-auto p-6 md:p-12 bg-gray-50">
        {/* Meal Details */}
        <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-lg overflow-hidden border border-gray-300">
          <img
            src={data.image}
            alt="Meal"
            className="w-full md:w-1/3 h-2/3 md:h-auto object-cover rounded-t-lg md:rounded-l-lg"
          />
          <div className="p-6 flex flex-col justify-between">
            <h1 className="text-3xl font-extrabold text-gray-800 hover:text-gray-600 transition-colors duration-300">
              {data.title}
            </h1>
            <p className="text-gray-500 text-lg">Distributor {data.distributor}</p>
            <p className="mt-4 text-gray-700 text-sm md:text-base">{data.description}</p>
            <p className="mt-4 text-gray-600 text-sm md:text-base">
              <strong>Ingredients:</strong> {data.ingredients}
            </p>
            <p className="mt-2 text-gray-600 text-sm md:text-base">Posted: {data.time}</p>
            <p className="mt-2 text-yellow-600 text-sm md:text-base">
              Rating: <span className="font-semibold">{data.rating}</span>
            </p>

            {/* Like Button */}
            {
              User ? <button
                onClick={() => like(data._id)}
                className="bg-blue-600 w-full text-white px-6 py-2 rounded-full mt-4 transform transition-transform hover:scale-105 hover:bg-blue-600"
              >
                Like
              </button> : <NavLink to={'/login'} state={{ from:location} }>
                <button className="bg-blue-600  w-full text-white px-6 py-2 rounded-full mt-4 transform transition-transform hover:scale-105 hover:bg-blue-600">like
                </button>
              </NavLink>
            }

            {/* Meal Request Button */}
            {
              User ? (
                // User is logged in
                user && user.badge !== "bronze" ? (
                  // User is logged in and badge is not "bronze"
                  <button
                    key={data._id}
                    onClick={request}
                    className="bg-green-600 text-white px-6  py-2 rounded-full mt-4 transform transition-transform hover:scale-105 hover:bg-green-700"
                  >
                    Request Meal
                  </button>
                ) : (
                  // User is logged in but badge is "bronze"
                  <button
                    className="bg-gray-400 text-white px-6  py-2 rounded-full mt-4 transform transition-transform hover:scale-105 cursor-not-allowed"
                    disabled
                  >
                    Cannot Request
                  </button>
                )
              ) : (
                // User is not logged in
                <NavLink to={'/login'} state={{ from: location}}>
                  <button className="bg-green-600 text-white px-6 w-full py-2 rounded-full mt-4 transform transition-transform hover:scale-105 hover:bg-green-700">
                    Request Meal
                  </button>
                </NavLink>

              )
            }




          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800">Reviews</h2>
          <div className="mt-6 space-y-6">
            {/* Sample Review */}
            {reviews.map((review) => (
              <div key={review._id} className={`${getRandomColor()} p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300`}>
                <p className="text-gray-800 text-lg md:text-xl">
                  {
                    review.review
                  }
                </p>
              </div>
            ))}
          </div>

          {/* Add Review */}
          <div className="mt-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
            <input
              ref={reviewInputRef} // Bind the ref to the input
              type="text"
              className="p-4 rounded-full border-2 border-gray-300 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-400 flex-1 text-lg md:text-xl transition-all duration-300 placeholder-gray-500"
              placeholder="Write a review..."
            />
            <button
              key={data._id}
              disabled={!User}

              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-full shadow-lg mt-4 md:mt-0 md:ml-6 transform transition-transform hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800"
              onClick={handleSubmit} // Handle form submission
            >
              Submit Review
            </button>
          </div>

        </section>
      </div>
    </>
  );
};

export default MealDetailPage;
