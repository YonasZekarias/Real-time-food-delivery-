import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = ["Confirmed", "Preparing", "On the way", "Delivered"];
const currentState = "Confirmed"; // Change this value dynamically as needed

const OrderStatus = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleViewOrder = () => {
    if (currentState === "Delivered") {
      setShowModal(true);
    } else {
      // Navigate to the NearbyRestaurants page
      navigate("/nearby");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="bg-gray-100 rounded-lg p-10 shadow-lg flex flex-col items-center space-y-6">
        <h1 className="text-3xl font-semibold text-center mb-6">
          Order Status
        </h1>
        <div className="flex items-center mb-12">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                {step === currentState ? (
                  <div
                    className="flex items-center justify-center rounded-full h-12 w-12 
                            border-none bg-red-500 border-2 border-gray-500 text-black font-semibold"
                  >
                    <i className="bx bx-check text-white text-xl"></i>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center rounded-full h-12 w-12
                            bg-white border-2 border-gray-500 text-black font-semibold"
                  >
                    {index + 1}
                  </div>
                )}
                <p className="mt-2 text-sm font-semibold">{step}</p>
              </div>
              {index !== steps.length - 1 && (
                <div className="h-[2px] w-20 bg-gray-500 mx-2"></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center mt-10">
          <button
            onClick={handleViewOrder}
            className="px-10 py-3 text-white font-semibold 
                border-none rounded-3xl bg-red-500 mt-10"
          >
            View Your Order
          </button>
        </div>
      </div>

      {/* Order Details Modal only for delivered orders */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <p className="mb-4">
              {/* Replace with your order detail content */}
              Your order has been delivered. Here are the details...
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
