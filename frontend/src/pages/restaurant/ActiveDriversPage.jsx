import React, { useEffect, useState } from "react";
import useAuthStore from "../../store/restaurant/authStore";
import useDriverStore from "../../store/restaurant/activeDriver";
import Sidebar from "../../components/restaurant/Sidebar";

const ActiveDriversPage = () => {
  const { restaurantId } = useAuthStore();
  const { drivers, loading, error, getActiveDrivers } = useDriverStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("available"); // default to available
  const [sidebarOpen, setSidebarOpen] = useState(false); // sidebar toggle for mobile

  useEffect(() => {
    if (restaurantId) {
      getActiveDrivers(restaurantId);
    }
  }, [restaurantId, getActiveDrivers]);

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.email.toLowerCase().includes(search.toLowerCase()) ||
      driver.phone.includes(search);
    const matchesStatus =
      statusFilter === "all" || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold animate-pulse">
          Loading active drivers...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div
        className={`flex-1 p-4 md:p-6 overflow-auto transition-all duration-300
          ${sidebarOpen ? "ml-64" : "ml-0"} sm:ml-24`}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold mb-4 text-gray-900">
          🚖 Active Drivers ({filteredDrivers.length})
        </h1>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by email or phone..."
            className="w-full md:w-1/3 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-red-400 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 rounded-xl border focus:ring-2 focus:ring-red-400 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Driver cards */}
        {filteredDrivers.length === 0 ? (
          <p className="text-gray-600 text-center mt-20">
            No drivers match your search/filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => (
              <div
                key={driver._id}
                className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-xl transition transform hover:-translate-y-1"
              >
                {/* Avatar + Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {driver.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {driver.email?.split("@")[0] || "Unknown Driver"}
                    </h2>
                    <p className="text-sm text-gray-500">{driver.email}</p>
                  </div>
                </div>

                {/* Driver Details */}
                <p className="text-sm text-gray-600 mb-1">
                  📞 Phone: <span className="font-medium">{driver.phone}</span>
                </p>

                <p
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                    driver.status === "available"
                      ? "bg-green-100 text-green-700"
                      : driver.status === "busy"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {driver.status}
                </p>

                <p
                  className={`mt-2 text-sm font-medium ${
                    driver.isVerified ? "text-blue-600" : "text-red-500"
                  }`}
                >
                  {driver.isVerified ? "✅ Verified" : "❌ Not Verified"}
                </p>

                <p className="text-xs text-gray-400 mt-3">
                  Joined:{" "}
                  {driver.createdAt
                    ? new Date(driver.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveDriversPage;
