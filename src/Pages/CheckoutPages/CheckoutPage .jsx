import React from "react";

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      {/* Package Details */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold">Premium Package</h2>
          <p className="text-gray-600">
            This package includes advanced features and priority support.
          </p>
          <p className="text-xl font-bold mt-2">$49.99</p>
        </div>

        {/* Payment Section */}
        <button
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Pay with Stripe
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
