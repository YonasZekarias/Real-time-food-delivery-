// src/pages/restaurant/StatsDashboard.jsx
import React, { useEffect } from "react";
import Sidebar from "../../components/restaurant/Sidebar";
import useStatsStore from "../../store/restaurant/statsStore";
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

export default function StatsDashboard() {
  const { orders, stats, loading, error, loadData } = useStatsStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Prepare data for bar chart
  const statusCounts = orders.reduce((acc, o) => {
    if (o?.status) acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(statusCounts).map((status) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: statusCounts[status]
  }));

  const colors = {
    pending: "#FACC15",
    accepted: "#3B82F6",
    preparing: "#A78BFA",
    ready: "#22C55E",
    delivered: "#16A34A",
    picked: "#6366F1",
    canceled: "#EF4444",
  };

  return (
    <div className="flex min-h-screen">
      <aside className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </aside>

      <main className="flex-1 ml-20 sm:ml-24 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Orders Statistics</h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">⚠️ {error}</p>
        ) : orders.length === 0 && !stats ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-bold mb-4">Orders & Revenue</h2>
              {stats ? (
                <PieChart width={400} height={400}>
                  <Pie
                    data={[
                      { name: "Total Orders", value: stats.totalOrders },
                      { name: "Total Revenue (5% of Delivered)", value: stats.totalRevenue }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    <Cell fill="#3B82F6" />
                    <Cell fill="#22C55E" />
                  </Pie>
                  <PieTooltip />
                  <PieLegend />
                </PieChart>
              ) : (
                <p className="text-gray-500">Loading stats...</p>
              )}
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-bold mb-4">Orders by Status</h2>
              <BarChart
                width={500}
                height={400}
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3B82F6">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[entry.name.toLowerCase()] || "#3B82F6"} />
                  ))}
                </Bar>
              </BarChart>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
