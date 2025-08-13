import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useStore from "../store/useStore";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { feedback, setFeedback } = useStore();

  const { cartItems, total, address, paymentMethod } = location.state || {};

  const handleFeedback = () => {
    navigate("/feedback");
  };

  const handleSkipFeedback = () => {
    navigate("/ordertracking");
  };

  if (!cartItems)
    return (
      <p className="text-center text-lg text-gray-600 mt-10">No order found.</p>
    );

  return (
    <div className="bg-white min-h-screen py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h1 className="text-3xl font-bold mb-4 text-[#FF0000]">
          Order Confirmed! 🎉
        </h1>
        <p className="text-gray-700 mb-4">
          Your delicious order is on its way!
        </p>

        <div className="mb-6">
          <p className="mb-2">
            <span className="font-semibold">Delivery Address:</span> {address}
          </p>
          <p>
            <span className="font-semibold">Payment Method:</span>{" "}
            {paymentMethod}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <ul className="space-y-1">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex justify-between border-b border-gray-100 pb-1"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span className="font-medium">
                  ${item.price * item.quantity}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-lg font-bold">
            Total: <span className="text-[#FF0000]">${total}</span>
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleFeedback}
            className="flex-1 bg-[#FFD700] hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg shadow-md transition-colors duration-200"
          >
            Go to Feedback
          </button>
          <button
            onClick={handleSkipFeedback}
            className="flex-1 bg-[#FF0000] hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-200"
          >
            Skip Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
