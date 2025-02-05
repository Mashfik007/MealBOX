import React, { useContext, useEffect } from "react";
import UserContext from "../../../../Hooks/Context/User_context";
import { useNavigate, useOutletContext } from "react-router-dom";

const PaymentHistory = () => {
  const paymentData = [1]; // Empty array to simulate no data found scenario
  const { User, signout } = useContext(UserContext); // Get user context
  const { UserData } = useOutletContext();
  const navigate = useNavigate();


  useEffect(() => {
    if (UserData && UserData.role !== "user") {
      signout(); // Sign the user out
      navigate("/login", { replace: true }); // Redirect to login page
    }
  }, [UserData, signout, navigate]);
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment History</h2>
        
        {paymentData.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            <p>No payment history available. Please make a payment to view your history.</p>
          </div>
        ) : (
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Payment Date</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 text-sm text-gray-800">2025-01-05</td>
                <td className="py-3 px-6 text-sm text-gray-600">$50.00</td>
                <td className="py-3 px-6 text-sm text-green-600">Completed</td>
                <td className="py-3 px-6 text-sm text-gray-600">Credit Card</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 text-sm text-gray-800">2024-12-25</td>
                <td className="py-3 px-6 text-sm text-gray-600">$30.00</td>
                <td className="py-3 px-6 text-sm text-yellow-600">Pending</td>
                <td className="py-3 px-6 text-sm text-gray-600">PayPal</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
