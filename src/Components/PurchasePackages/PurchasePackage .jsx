import React, { useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast, { Toaster } from "react-hot-toast";
import silver from "../../assets/silver.jpg";
import Gold from "../../assets/Gold.jpg";
import Platinum from "../../assets/Platinum.jpg";
import { useLocation } from "react-router-dom";
import User_context from "../../Hooks/Context/User_context";
import useAxiosSecure from "../../Hooks/Axios secure/useAxiosSecure";

// Load Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const CheckoutForm = ({ price, packageName }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { User } = useContext(User_context);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements) {
      return; // Stripe.js has not yet loaded
    }
  
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
  
    if (error) {
      toast.error(error.message);
      return;
    }
  
    try {
      // Step 1: Create a payment intent
      const response = await axiosSecure.post("/create-payment-intent", {
        amount: price * 100, // Convert price to cents
        email: User.email,
        packageName,
      });
  
      const { clientSecret, insertedId } = response.data;
  
      // Step 2: Confirm the payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });
  
      if (confirmError) {
        toast.error(confirmError.message);
      } else if (paymentIntent.status === "succeeded") {
        // Format date to a readable format
        const formattedDate = new Date().toLocaleDateString("en-US", {
            year: "2-digit",
            month: "numeric",
            day: "numeric",
          });
          
  
        // Step 3: Update payment status in the database
        const updateResponse = await axiosSecure.post("/payments", {
          clientSecret,
          status: "succeeded",
          date: formattedDate,
        });
  
        if (updateResponse.data.message) {
          toast.success("Payment successful and recorded!");
        } else {
          toast.error("Payment succeeded but failed to update the database.");
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };
  
  
  

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <CardElement className="p-3 border rounded-lg" />
      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition mt-4"
        disabled={!stripe}
      >
        Pay ${price}
      </button>
    </form>
  );
};

const PurchasePackage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const data = JSON.parse(decodeURIComponent(queryParams.get("data")));
  const price = parseInt(data.price);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-4xl w-full space-y-8">
        {/* Package Details */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            The {data.name} package
          </h1>
          <img src={data.name === "Silver" ? silver : data.name === "Gold" ? Gold : Platinum} alt="" />
          <p className="mt-4 text-gray-600 text-center">
            Unlock exclusive features and benefits with our premium package.
          </p>
          <div className="mt-6 text-center">
            <p className="text-xl font-semibold text-gray-800">${data.price}</p>
            <p className="text-sm text-gray-500">One-time payment</p>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-800">Payment Details</h2>
          <Elements stripe={stripePromise}>
            <CheckoutForm price={price} packageName={data.name} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default PurchasePackage;
