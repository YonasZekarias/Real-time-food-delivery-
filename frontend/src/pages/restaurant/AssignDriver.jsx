import React, { useEffect, useState } from "react";
import useAuthStore from "../../store/restaurant/authStore";
import useAssignDriverStore from "../../store/restaurant/assignDriverStore";
import { Toaster } from "react-hot-toast";
import Sidebar from "../../components/restaurant/Sidebar";
import { Loader2, User, Phone, Package, Truck } from "lucide-react";

const AssignDriverPage = () => {
  const { restaurantId } = useAuthStore();
  const { orders, drivers, loading, assigning, loadData, assignToOrder } =
    useAssignDriverStore();

  const [selectedDrivers, setSelectedDrivers] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

  // fetch data on mount
  useEffect(() => {
    if (restaurantId) loadData(restaurantId);
  }, [restaurantId, loadData]);

  const handleAssign = (orderId) => {
    const driverId = selectedDrivers[orderId];
    if (driverId) assignToOrder(orderId, driverId);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin w-8 h-8 text-red-500" />
        <p className="ml-3 text-lg font-medium text-gray-700">
          Loading orders and drivers...
        </p>
      </div>
    );

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    ready: "bg-green-100 text-green-700",
    accepted: "bg-blue-100 text-blue-700",
    delivered: "bg-gray-200 text-gray-700",
    canceled: "bg-red-100 text-red-600",
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div
        className={`flex-1 p-4 sm:p-8 transition-all duration-300
          ${sidebarOpen ? "ml-64" : "ml-0"} sm:ml-24`}
      >
        <Toaster position="top-right" />

        <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-10 text-gray-900 tracking-tight">
          🚚 Assign Drivers to Orders
        </h1>

        {orders.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow">
            <p className="text-gray-500 text-lg">No orders available.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white/90 backdrop-blur-sm shadow-md rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-xl transition duration-300"
              >
                {/* Order Info */}
                <div className="space-y-2 sm:space-y-3 mb-4">
                  <p className="flex items-center gap-2 font-semibold text-gray-800 text-sm sm:text-base break-all">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                    Order: <span>{order._id}</span>
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    <span className="font-medium">Total:</span> ${order.total} |{" "}
                    <span
                      className={`px-2 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm font-medium ${
                        statusColors[order.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                    <User className="w-4 h-4 text-gray-500" />
                    {order.customerId?.name || "N/A"}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                    <Phone className="w-4 h-4 text-gray-500" />
                    {order.customerId?.phone || "N/A"}
                  </p>
                </div>

                {/* Driver Assignment */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <select
                    className="border border-gray-300 rounded-xl px-3 sm:px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none flex-1 cursor-pointer hover:border-red-400 transition text-sm sm:text-base"
                    value={selectedDrivers[order._id] || ""}
                    onChange={(e) =>
                      setSelectedDrivers((prev) => ({
                        ...prev,
                        [order._id]: e.target.value,
                      }))
                    }
                  >
                    <option value="">👨‍✈️ Select driver</option>
                    {drivers.map((driver) => (
                      <option key={driver._id} value={driver._id}>
                        {driver.email.split("@")[0]} ({driver.phone})
                      </option>
                    ))}
                  </select>
                  <button
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition shadow-sm disabled:opacity-60 text-sm sm:text-base"
                    onClick={() => handleAssign(order._id)}
                    disabled={assigning}
                  >
                    <Truck className="w-4 h-4" />
                    {assigning ? "Assigning..." : "Assign"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignDriverPage;
