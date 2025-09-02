import React from "react";
import {
  FiHome,
  FiBookOpen,
  FiShoppingCart,
  FiActivity,
  FiSettings,
  FiLogOut,
  FiBox,
} from "react-icons/fi"; // Added FiBox for Inventory icon
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/restaurant/authStore";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore(); // ✅ inside component
  const restaurantId = useAuthStore((state) => state.restaurantId); // Assuming restaurantId is in authStore

  const navItems = [
    { label: "Dashboard", icon: FiHome, path: "/restaurant/dashboard" },
    { label: "Menu", icon: FiBookOpen, path: "/restaurant/menu" },
    { label: "Inventory", icon: FiBox, path: `/inventory/${restaurantId}` },
    { label: "Orders", icon: FiShoppingCart, path: "/restaurant/orders" },
    { label: "Status", icon: FiActivity, path: "/restaurant/status" },
    { label: "Settings", icon: FiSettings, path: "/restaurant/settings" },
  ];

  return (
    <div className="w-20 sm:w-24 bg-white border-r h-screen flex flex-col items-center py-6 gap-8 fixed left-0 top-0 z-10">
      <img
        src="https://static.vecteezy.com/system/resources/previews/008/687/818/non_2x/food-delivery-logo-free-vector.jpg"
        alt="Logo"
        className="w-12 h-12 object-contain mb-4"
      />

      <div className="flex flex-col gap-6">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center text-xs ${
                isActive ? "text-red-500 font-semibold" : "text-gray-600"
              } hover:text-red-500 transition`}
            >
              <Icon size={20} />
              <span className="mt-1">{label}</span>
            </button>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            navigate("/restaurant/login");
          }}
          className="flex flex-col items-center text-xs text-gray-600 hover:text-red-500 transition"
        >
          <FiLogOut size={20} />
          <span className="mt-1">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
