// src/pages/restaurant/CreateDriver.jsx
import React, { useState } from "react";
import axios from "axios";
import useAuthStore from "../../store/restaurant/authStore";
import RestaurantSidebar from "../../components/restaurant/Sidebar";

const CreateDriver = () => {
  const { restaurantId } = useAuthStore(); 
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/delivery/drivers/register",
        { ...form, restaurantId },
        { withCredentials: true }
      );

      if (res.data.status === "success") {
        setMessage("✅ Driver created successfully!");
        setForm({ name: "", email: "", phone: "", password: "" });
      } else {
        setMessage(res.data.message || "❌ Failed to create driver");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong while creating driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <RestaurantSidebar />

      {/* Main content */}
      <div className="flex-1 p-6 sm:ml-64">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center">🚚 Create Driver</h1>
          <p className="text-center text-gray-600 mt-1">
            Add a new delivery driver to manage your restaurant orders
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200">
          {message && (
            <p
              className={`mb-6 text-center font-medium ${
                message.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Driver Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Driver Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Driver Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Driver Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
            >
              {loading ? "Creating..." : "Create Driver"}
            </button>
          </form>
        </div>

        {/* Footer / Boilerplate */}
        <footer className="text-center mt-12 text-gray-400 text-sm">
          © {new Date().getFullYear()} Your Restaurant Dashboard. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default CreateDriver;
