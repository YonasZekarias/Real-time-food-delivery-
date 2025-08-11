import React from "react";
import {
  FiHome,
  FiMap,
  FiShoppingBag,
  FiTag,
  FiSettings,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", icon: FiHome, path: "/" },
    { label: "Explore", icon: FiMap, path: "/nearby" },
    { label: "Orders", icon: FiShoppingBag, path: "/orders" },
    { label: "Promos", icon: FiTag, path: "/promos" },
    { label: "Setting", icon: FiSettings, path: "/settings" },
  ];

  return (
    <div className="w-20 sm:w-24 bg-white border-r h-screen flex flex-col items-center py-6 gap-8 fixed left-0 top-0 z-10">
      {/* Logo */}
      <img
        src="https://static.vecteezy.com/system/resources/previews/008/687/818/non_2x/food-delivery-logo-free-vector.jpg"
        alt="Logo"
        className="w-12 h-12 object-contain mb-4"
      />

      {/* Navigation Items */}
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
      </div>
    </div>
  );
};

export default Sidebar;
