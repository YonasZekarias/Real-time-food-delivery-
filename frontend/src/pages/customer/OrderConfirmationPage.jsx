import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const currency = (n) => (typeof n === "number" ? n.toFixed(2) : n);

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { order } = location.state || {};

  // Updated handler to navigate to OrderStatus page
  const handleConfirmOrder = () => {
    navigate("/order-status");
  };

  const handleFeedback = () => {
    navigate("/feedback");
  };

  if (!order) {
    return (
      <div className="relative min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
        <div className="pointer-events-none absolute -top-10 -right-10 w-1/3 h-1/3 bg-yellow-300 rounded-full filter blur-[150px] opacity-20" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 w-1/3 h-1/3 bg-red-400 rounded-full filter blur-[150px] opacity-20" />

        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-red-600">
            No Order Found
          </h1>
          <p className="text-gray-600">
            It seems you haven't placed an order yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white min-h-screen overflow-hidden py-4 sm:py-6 md:py-10 px-4 sm:px-6">
      <div className="pointer-events-none absolute top-[-10%] right-[-10%] w-1/2 h-1/2 md:w-1/3 md:h-1/3 bg-yellow-300 rounded-full filter blur-[150px] opacity-20" />
      <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] w-1/2 h-1/2 md:w-1/3 md:h-1/3 bg-red-400 rounded-full filter blur-[150px] opacity-20" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="group bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 hover:bg-yellow-100/60 transition-all duration-300">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 text-red-600">
            Confirm your Order
          </h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Your delicious order is on its way!
          </p>

          <div className="mb-6 space-y-3 text-sm sm:text-base">
            <p className="text-gray-800">
              <span className="font-semibold text-gray-800">
                Delivery Location:
              </span>{" "}
              <span className="text-gray-700 break-words">
                {order.deliveryLocation.coordinates[1].toFixed(4)},{" "}
                {order.deliveryLocation.coordinates[0].toFixed(4)}
              </span>
            </p>
            <p className="text-gray-800">
              <span className="font-semibold text-gray-800">
                Payment Method:
              </span>{" "}
              <span className="text-gray-700 capitalize">
                {order.paymentMethod}
              </span>
            </p>
            <p className="text-gray-800">
              <span className="font-semibold text-gray-800">Order ID:</span>{" "}
              <span className="text-gray-700">{order._id}</span>
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 text-red-600">
              Order Summary
            </h2>
            <ul className="space-y-2 text-sm sm:text-base">
              {order.items.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center border-b border-gray-200/80 pb-2 text-gray-800"
                >
                  <span className="text-gray-700">
                    {item.name}{" "}
                    <span className="text-gray-500">× {item.quantity}</span>
                  </span>
                  <span className="font-medium">
                    ${currency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-base sm:text-lg font-extrabold text-gray-800 flex justify-between items-center">
              <span>Total:</span>
              <span className="text-red-600">${currency(order.total)}</span>
            </p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleConfirmOrder}
              className="w-full max-w-xs mx-auto inline-flex items-center justify-center font-semibold py-3 rounded-xl shadow-md transition-all duration-300 bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/40 active:scale-[0.98]"
            >
              Confirm Order
            </button>
            <p className="mt-4 text-sm">
              <span className="text-gray-600">
                Want to rate your experience?{" "}
              </span>
              <button
                onClick={handleFeedback}
                className="text-red-600 hover:underline font-semibold"
              >
                Leave a feedback
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
