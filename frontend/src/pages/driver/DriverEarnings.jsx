import React, { useEffect, useMemo } from "react";
import DriverSidebar from "../../components/driver/Sidebar";
import useDriverEarningsStore from "../../store/driver/earningsStore";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4CAF50", "#2196F3", "#FF9800"]; // green, blue, orange

export default function DriverEarnings() {
  const { driverId, earnings, loading, error, init, loadEarnings } =
    useDriverEarningsStore();

  // Initialize auth and driverId
  useEffect(() => {
    init();
  }, [init]);

  // Load earnings when driverId is available
  useEffect(() => {
    if (driverId) loadEarnings(driverId);
  }, [driverId, loadEarnings]);

  // Prepare data for charts
  const earningsData = useMemo(() => {
    if (!earnings) return [];
    return [
      { name: "Today", value: earnings.todayEarnings },
      { name: "Weekly", value: earnings.weeklyEarning },
      { name: "Total", value: earnings.totalEarnings },
    ];
  }, [earnings]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Loading earnings...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="flex">
      <DriverSidebar />
      <div className="flex-1 ml-20 sm:ml-24 p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Driver Earnings</h2>

        {earnings ? (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
                <h3 className="text-sm text-gray-500">Today's Orders</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  {earnings.todaysOrderCount}
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
                <h3 className="text-sm text-gray-500">Today's Earnings</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  ${earnings.todayEarnings}
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
                <h3 className="text-sm text-gray-500">Weekly Earnings</h3>
                <p className="text-2xl font-bold text-purple-600 mt-2">
                  ${earnings.weeklyEarning}
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
                <h3 className="text-sm text-gray-500">Total Earnings</h3>
                <p className="text-2xl font-bold text-red-600 mt-2">
                  ${earnings.totalEarnings}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">Earnings Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={earningsData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(val) => `$${val}`} />
                    <Legend />
                    <Bar dataKey="value" fill="#2196F3">
                      {earningsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">Earnings Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={earningsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: $${value}`}
                    >
                      {earningsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => `$${val}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-600">No earnings data available</p>
        )}
      </div>
    </div>
  );
}
