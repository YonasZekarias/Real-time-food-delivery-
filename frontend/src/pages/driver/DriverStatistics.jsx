import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../store/customer/authStore";
import DriverSidebar from "../../components/driver/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const DriverStatistics = () => {
  const { user, checkAuth } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ORDER_PRICE = 100;
  const driverStatuses = ["ready", "picked", "en_route", "delivered", "canceled"];
  const statusColors = {
    ready: "#facc15",
    picked: "#60a5fa",
    en_route: "#4ade80",
    delivered: "#10b981",
    canceled: "#f87171",
  };

  // Color per weekday (Mon → Sun)
  const dayColors = [
    "#4ade80", // Mon
    "#60a5fa", // Tue
    "#facc15", // Wed
    "#f87171", // Thu
    "#a78bfa", // Fri
    "#f87171", // Sat
    "#60a5fa", // Sun
  ];

  // ------------------- AUTH AND FETCH ORDERS -------------------
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      if (!user) {
        const res = await checkAuth();
        if (!res.success) {
          setError("Driver not logged in. Please login again.");
          setLoading(false);
          return;
        }
      }

      try {
        const res = await axios.get("http://localhost:5000/api/delivery/orders/all", {
          withCredentials: true,
        });
        const data = Array.isArray(res.data.data)
          ? res.data.data
          : res.data.data?.orders || [];
        const driverOrders = data.filter((o) => driverStatuses.includes(o.status));
        setOrders(driverOrders);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user, checkAuth]);

  // ------------------- CALCULATE GRAPH DATA -------------------
  const getBarChartData = () => {
    const now = new Date();
    const days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", { weekday: "short" });

      const deliveredOrders = orders.filter(
        (o) =>
          o.status === "delivered" &&
          new Date(o.createdAt).toDateString() === date.toDateString()
      );

      return {
        day: dateStr,
        earnings: deliveredOrders.length * ORDER_PRICE,
        orders: deliveredOrders.length,
      };
    });

    return days.reverse();
  };

  const getPieChartData = () => {
    const statusCount = {};
    driverStatuses.forEach((status) => (statusCount[status] = 0));
    orders.forEach((o) => {
      statusCount[o.status] = (statusCount[o.status] || 0) + 1;
    });
    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  };

  if (loading) return <p className="text-center mt-10">Loading statistics...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DriverSidebar />

      <div className="flex-1 ml-20 sm:ml-24 p-6">
        <h1 className="text-3xl font-bold text-center mb-6">📊 Driver Statistics</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Vertical Bar Chart */}
          <div className="flex-1 p-4 border rounded-lg shadow bg-white h-[500px]">
            <h2 className="text-xl font-semibold mb-4 text-center">Last 7 Days Earnings</h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getBarChartData()}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                barCategoryGap="0%"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 border rounded shadow">
                          <p><strong>{data.day}</strong></p>
                          <p>Earnings: ${data.earnings}</p>
                          <p>Orders: {data.orders}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="earnings" barSize={80} radius={[6, 6, 0, 0]}>
                  {getBarChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={dayColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Circular Pie Chart */}
          <div className="flex-1 p-4 border rounded-lg shadow bg-white h-[500px]">
            <h2 className="text-xl font-semibold mb-4 text-center">Order Status Distribution</h2>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getPieChartData()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={160}
                  innerRadius={60}
                  label
                >
                  {getPieChartData().map((entry, index) => (
                    <Cell key={index} fill={statusColors[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={50} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverStatistics;
