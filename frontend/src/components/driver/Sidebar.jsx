import React, { useEffect, useState } from "react";
import {
  FiHome,
  FiDollarSign,
  FiShoppingBag,
  FiCheckCircle,
  FiLogOut,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/customer/authStore"; // ✅ adjust path if needed

const DriverSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const [driverId, setDriverId] = useState(null);

  // Get driverId from backend via cookie auth
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await checkAuth(); // returns { success, data: { userId, role } }
        if (res.success && res.data.role === "driver") {
          setDriverId(res.data.userId);
        }
      } catch (err) {
        console.error("Failed to fetch driverId", err);
      }
    };
    fetchDriver();
  }, [checkAuth]);

  const driverNavItems = [
    { label: "Dashboard", icon: FiHome, path: "/driver/dashboard" },
    { label: "Earnings", icon: FiDollarSign, path: "/driver/earnings" },
    {
      label: "Orders",
      icon: FiShoppingBag,
      path: driverId ? `/driver/orders/${driverId}` : "/driver/orders",
    },
    { label: "Status", icon: FiCheckCircle,
        path: driverId ? `/driver/status/${driverId}` : "/driver/status",
     },
  ];

  const handleLogout = () => {
    logout(); // clear auth (token/cookies)
    navigate("/driver/login");
  };

  return (
    <div className="w-20 sm:w-24 bg-white border-r h-screen flex flex-col items-center py-6 gap-8 fixed left-0 top-0 z-10 shadow-md">
      {/* Logo */}
      <img
        src="https://static.vecteezy.com/system/resources/previews/008/687/818/non_2x/food-delivery-logo-free-vector.jpg"
        alt="Logo"
        className="w-12 h-12 object-contain mb-4"
      />

      {/* Navigation Items */}
      <div className="flex flex-col gap-6 flex-grow">
        {driverNavItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;

          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              disabled={label === "Orders" && !driverId} // disable Orders until driverId is loaded
              className={`flex flex-col items-center text-xs ${
                isActive ? "text-red-500 font-semibold" : "text-gray-600"
              } hover:text-red-500 transition`}
            >
              <Icon size={20} />
              <span className="mt-1">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center text-xs text-gray-600 hover:text-red-500 transition"
      >
        <FiLogOut size={20} />
        <span className="mt-1">Logout</span>
      </button>
    </div>
  );
};

export default DriverSidebar;
