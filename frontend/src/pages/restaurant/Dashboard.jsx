// src/pages/restaurant/Dashboard.jsx
import React, { useEffect } from "react";
import Sidebar from "../../components/restaurant/Sidebar";
import useOrderStore from "../../store/restaurant/restaurantorderStore";

export default function Dashboard() {
  const { orders, loading, error, fetchOrders, updateStatus, cancelOrder } =
    useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatBirr = (x) => "Br " + (x || 0).toLocaleString();

  const nextStatuses = ["pending", "accepted", "preparing", "ready"];
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    accepted: "bg-blue-100 text-blue-700 border-blue-300",
    preparing: "bg-purple-100 text-purple-700 border-purple-300",
    ready: "bg-green-100 text-green-700 border-green-300",
    delivered: "bg-green-200 text-green-800 border-green-400",
    picked: "bg-indigo-100 text-indigo-700 border-indigo-300",
    canceled: "bg-red-100 text-red-700 border-red-300",
  };

  const totalOrders = orders.length;
  const statusCounts = orders.reduce((acc, o) => {
    if (o?.status) acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full z-10 w-20 sm:w-24">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 sm:ml-24 p-4 sm:p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Orders Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <p className="text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </div>
          {["pending", "accepted", "preparing", "ready", "picked", "delivered", "canceled"].map(
            (status) => (
              <div
                key={status}
                className={`p-6 rounded-2xl shadow border hover:shadow-lg transition ${statusColors[status]}`}
              >
                <p className="capitalize font-medium">{status}</p>
                <p className="text-2xl font-bold">{statusCounts[status] || 0}</p>
              </div>
            )
          )}
        </div>

        {/* Orders Table */}
        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">⚠️ {error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow">
            <table className="w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Customer Email</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Total</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-4 text-sm">{order.customerId?.email || "Unknown"}</td>
                    <td className="p-4 text-sm">{order.customerId?.phone || "N/A"}</td>
                    <td className="p-4 text-sm">{formatBirr(order.total)}</td>
                    <td className={`p-4 text-sm capitalize font-medium ${statusColors[order.status] || ""}`}>
                      {order.status}
                    </td>
                    <td className="p-4">
                      <select
                        className="w-full p-2 border rounded-lg"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "canceled") cancelOrder(order._id);
                          else updateStatus(order._id, value);
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>Select Status</option>
                        {nextStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                        {order.status !== "canceled" && (
                          <option value="canceled">Cancel</option>
                        )}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
