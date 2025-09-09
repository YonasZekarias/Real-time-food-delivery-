// src/pages/restaurant/RegisterDriver.jsx
import React, { useState } from "react";
import Sidebar from "../../components/restaurant/Sidebar";
import useDriverStore from "../../store/restaurant/driverStore";

export default function RegisterDriver() {
  const { registerDriver, loading, message } = useDriverStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await registerDriver(form);
    if (user) {
      setForm({ name: "", email: "", phone: "", password: "" });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-20 sm:ml-24 p-8 bg-gray-100 min-h-screen">
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
          <h2 className="text-xl font-bold mb-4">Register Driver</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {loading ? "Registering..." : "Register Driver"}
            </button>
          </form>
          {message && (
            <p className={`mt-4 text-center font-medium ${loading ? "text-blue-600" : "text-green-600"}`}>
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
