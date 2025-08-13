import React from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    address,
    paymentMethod,
    setAddress,
    setPaymentMethod,
    clearCart,
  } = useStore();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    navigate("/order-confirmation", {
      state: { cartItems, total, address, paymentMethod },
    });
    clearCart();
  };

  if (cartItems.length === 0)
    return (
      <p className="text-center text-lg text-gray-600 mt-10">
        Your cart is empty.
      </p>
    );

  return (
    <div className="bg-white min-h-screen py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-[#FF0000]">Checkout</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Address</h2>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address"
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
          <label className="flex items-center space-x-2 mb-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-[#FF0000] focus:ring-[#FFD700]"
            />
            <span>Cash on Delivery</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-[#FF0000] focus:ring-[#FFD700]"
            />
            <span>Credit/Debit Card (mock)</span>
          </label>
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

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-[#FF0000] hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-200"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
