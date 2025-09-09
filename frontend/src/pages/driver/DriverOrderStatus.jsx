import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import DriverSidebar from "../../components/driver/Sidebar";
import useDriverOrdersStore from "../../store/driver/ordersStatsStore";
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

const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#F44336"]; // green, blue, orange, red

export default function DriverOrderStatus() {
  const { driverId } = useParams();
  const { orders, loading, error, loadOrders } = useDriverOrdersStore();

  // Load orders
  useEffect(() => {
    if (driverId) loadOrders(driverId);
  }, [driverId, loadOrders]);

  // Aggregate orders by status
  const statusData = useMemo(() => {
    const counts = { pending: 0, picked: 0, delivered: 0, canceled: 0 };
    orders.forEach((order) => {
      if (counts[order.status] !== undefined) counts[order.status]++;
    });
    return Object.entries(counts).map(([status, count]) => ({ name: status, value: count }));
  }, [orders]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Loading order summary...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DriverSidebar />

      <div className="flex-1 ml-20 sm:ml-24 p-6">
        <h2 className="text-2xl font-bold mb-6">Driver Order Summary</h2>

        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <div className="p-4 rounded-lg shadow-sm bg-white">
              <h3 className="text-xl font-semibold mb-4">Orders by Status</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={statusData} margin={{ top: 10, bottom: 10 }}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="p-4 rounded-lg shadow-sm bg-white">
              <h3 className="text-xl font-semibold mb-4">Order Distribution</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
