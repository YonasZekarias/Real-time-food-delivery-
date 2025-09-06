// src/pages/driver/DriverDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/customer/authStore";
import DriverSidebar from "../../components/driver/Sidebar";

const statusColors = {
  ready: "bg-blue-100 text-blue-800",
  picked: "bg-purple-100 text-purple-800",
  en_route: "bg-yellow-100 text-yellow-800",
  delivered: "bg-green-100 text-green-800",
  canceled: "bg-red-100 text-red-800",
};

const driverStatuses = ["ready", "picked", "en_route", "delivered", "canceled"];

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuthStore();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const ORDER_PAY = 100;

  // ------------------- AUTH CHECK -------------------
  useEffect(() => {
    const verifySession = async () => {
      setLoadingAuth(true);
      const res = await checkAuth();
      if (!res.success) {
        navigate("/");
      }
      setLoadingAuth(false);
    };
    verifySession();
  }, [checkAuth, navigate]);

  // ------------------- FETCH ORDERS -------------------
  useEffect(() => {
    if (!user?.userId) return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/api/delivery/orders/all",
          { withCredentials: true }
        );

        const data = Array.isArray(res.data.data)
          ? res.data.data
          : res.data.data?.orders || [];

        const driverOrders = data.filter((order) =>
          driverStatuses.includes(order.status)
        );

        setOrders(driverOrders);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  // ------------------- CALCULATE EARNINGS -------------------
  const calculateEarnings = () => {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - 7);

    const totalOrders = orders.length;

    const todaysOrders = orders.filter(
      (o) => new Date(o.createdAt) >= startOfToday
    ).length;

    const todaysDelivered = orders.filter(
      (o) =>
        o.status === "delivered" && new Date(o.createdAt) >= startOfToday
    ).length;

    const weeklyDelivered = orders.filter(
      (o) => o.status === "delivered" && new Date(o.createdAt) >= startOfWeek
    ).length;

    return {
      totalOrders,
      todaysOrders,
      todayEarnings: todaysDelivered * ORDER_PAY,
      weeklyEarnings: weeklyDelivered * ORDER_PAY,
    };
  };

  const earnings = calculateEarnings();

  // ------------------- UPDATE STATUS -------------------
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.post(
        `http://localhost:5000/api/delivery/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  // ------------------- RENDER -------------------
  if (loadingAuth) return <p className="text-center mt-10">Checking session...</p>;
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DriverSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 sm:ml-24">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between mb-6 sm:mb-8 gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-center">🚚 Driver Dashboard</h1>
        </div>

        {/* Earnings */}
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
            💰 Earnings
          </h2>
          <div
            className="
              grid gap-4
              grid-cols-2      /* phone: 2 cards per row */
              sm:grid-cols-2   /* tablet: 2 cards per row */
              lg:grid-cols-4   /* desktop: 4 cards per row */
            "
          >
            <div className="p-4 border rounded-lg shadow bg-gray-50 text-center">
              <h3 className="font-semibold">Total Orders</h3>
              <p className="text-xl sm:text-2xl">{earnings.totalOrders}</p>
            </div>
            <div className="p-4 border rounded-lg shadow bg-green-50 text-center">
              <h3 className="font-semibold">Today's Orders</h3>
              <p className="text-xl sm:text-2xl">{earnings.todaysOrders}</p>
            </div>
            <div className="p-4 border rounded-lg shadow bg-yellow-50 text-center">
              <h3 className="font-semibold">Today's Earnings</h3>
              <p className="text-xl sm:text-2xl">${earnings.todayEarnings}</p>
            </div>
            <div className="p-4 border rounded-lg shadow bg-blue-50 text-center">
              <h3 className="font-semibold">Weekly Earnings</h3>
              <p className="text-xl sm:text-2xl">${earnings.weeklyEarnings}</p>
            </div>
          </div>
        </section>

        {/* Orders */}
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
            📦 Orders
          </h2>
          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500 text-center">No orders assigned.</p>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="p-4 sm:p-6 border rounded-xl shadow bg-white hover:shadow-lg transition flex flex-col"
                >
                  <p>
                    <span className="font-medium">Customer:</span>{" "}
                    {order.customerId?.email || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Items Total:</span> $
                    {order.total || "0.00"}
                  </p>

                  {/* Items */}
                  <div className="mt-3">
                    <span className="font-medium">Items:</span>
                    {order.items.map((item) => (
                      <div key={item._id} className="ml-3 text-gray-700 text-sm">
                        {item.name} (x{item.quantity}) – ${item.price}
                      </div>
                    ))}
                  </div>

                  {/* Status + Update */}
                  <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}
                    >
                      {order.status.toUpperCase()}
                    </span>

                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="border p-2 rounded-md text-gray-700 w-full sm:w-auto"
                    >
                      <option value={order.status} disabled>
                        Update status
                      </option>
                      {driverStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default DriverDashboard;
