import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/customer/cartStore";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  Popup,
} from "react-leaflet";
import { createOrder } from "../../api/customer/orderApi.js";

function LocationMarker({ position, setPosition }) {
  const map = useMap();

  useEffect(() => {
    if (!position) {
      map.locate().on("locationfound", function (e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      });
    }
  }, [map, position, setPosition]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Your selected location</Popup>
    </Marker>
  );
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCartStore();

  const [position, setPosition] = useState(null);
  const [paymentMethod, setPaymentMethod] = React.useState("cash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const formatCurrency = (n) => `$${Number(n || 0).toFixed(2)}`;

  const handlePlaceOrder = async () => {
    if (!position) {
      setError("Please select a delivery location.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const orderData = {
        deliveryLocation: {
          type: "Point",
          coordinates: [position.lng, position.lat],
        },
        paymentMethod,
      };
      const response = await createOrder(orderData);
      clearCart();
      navigate("/order-confirmation", {
        state: { order: response.data },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0)
    return (
      <div className="relative min-h-screen bg-white flex items-center justify-center p-6">
        <div className="pointer-events-none absolute -top-10 -right-10 w-1/3 h-1/3 bg-yellow-300 rounded-full filter blur-[150px] opacity-20" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 w-1/3 h-1/3 bg-red-400 rounded-full filter blur-[150px] opacity-20" />

        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-2xl shadow-lg p-8 text-center max-w-lg w-full">
          <h1 className="text-3xl font-bold mb-3 text-red-600">
            Your cart is empty
          </h1>
          <p className="text-gray-600">Add some items to get started.</p>
        </div>
      </div>
    );

  return (
    <div className="relative bg-white min-h-screen py-10 px-6">
      <div className="pointer-events-none absolute top-0 right-0 w-1/3 h-1/3 bg-yellow-300 rounded-full filter blur-[150px] opacity-20" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-1/3 h-1/3 bg-red-400 rounded-full filter blur-[150px] opacity-20" />

      <div className="relative max-w-2xl mx-auto bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-red-600">
          Checkout
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Delivery Location
          </h2>
          <div className="group relative bg-gray-100/80 border border-gray-200/80 rounded-xl p-3 hover:bg-yellow-100/60 transition-all duration-300">
            <MapContainer
              center={{ lat: 51.505, lng: -0.09 }}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "400px" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
            {position && (
              <p className="text-center text-sm text-gray-600 mt-2">
                Selected Location: {position.lat.toFixed(4)},{" "}
                {position.lng.toFixed(4)}
              </p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Payment Method
          </h2>
          <div className="grid gap-2">
            <label className="flex items-center gap-3 bg-gray-100/80 border border-gray-200/80 rounded-xl p-3 hover:bg-yellow-100/60 transition-all duration-300 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="accent-red-600 focus:ring-yellow-500 focus:outline-none"
              />
              <span className="text-gray-800">Cash on Delivery</span>
            </label>
            <label className="flex items-center gap-3 bg-gray-100/80 border border-gray-200/80 rounded-xl p-3 hover:bg-yellow-100/60 transition-all duration-300 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="mobile_banking"
                checked={paymentMethod === "mobile_banking"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="accent-red-600 focus:ring-yellow-500 focus:outline-none"
              />
              <span className="text-gray-800">Mobile Banking</span>
            </label>
            <label className="flex items-center gap-3 bg-gray-100/80 border border-gray-200/80 rounded-xl p-3 hover:bg-yellow-100/60 transition-all duration-300 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="accent-red-600 focus:ring-yellow-500 focus:outline-none"
              />
              <span className="text-gray-800">Credit/Debit Card</span>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Order Summary
          </h2>
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center bg-gray-100/80 border border-gray-200/80 rounded-xl px-4 py-2 hover:bg-yellow-100/60 transition-colors"
              >
                <span className="text-gray-700">
                  {item.name}{" "}
                  <span className="text-gray-500">× {item.quantity}</span>
                </span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-lg font-extrabold text-gray-800 flex items-center justify-between">
            <span>Total</span>
            <span className="text-red-600">{formatCurrency(total)}</span>
          </p>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <button
          onClick={handlePlaceOrder}
          disabled={!position || loading}
          className="w-full inline-flex items-center justify-center font-semibold py-3 rounded-xl shadow-md transition-all duration-300 bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
