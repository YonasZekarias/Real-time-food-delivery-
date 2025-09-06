// src/components/driver/Sidebar.jsx
import React, { useState } from "react";
import {
  FiHome,
  FiShoppingCart,
  FiActivity,
  FiLogOut,
  FiDollarSign,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/restaurant/authStore";

const DriverSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: FiHome, path: "/driver/dashboard" },
    { label: "Orders", icon: FiShoppingCart, path: "/driver/orders" },
    { label: "Earnings", icon: FiDollarSign, path: "/driver/earnings" },
    { label: "Status", icon: FiActivity, path: "/driver/status" },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-20 bg-white p-2 rounded-md shadow-lg"
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r shadow-lg flex flex-col items-center py-6 z-30 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:w-20 lg:w-24`}
        style={{
          width: isOpen ? "80px" : "", // popup width on mobile
        }}
      >
        {/* Close Button (mobile only) */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 md:hidden"
        >
          <FiX size={24} />
        </button>

        {/* Logo */}
        <img
          src="https://static.vecteezy.com/system/resources/previews/008/687/818/non_2x/food-delivery-logo-free-vector.jpg"
          alt="Logo"
          className="w-12 h-12 object-contain mb-6"
        />

        {/* Navigation */}
        <div className="flex flex-col gap-6 flex-1 w-full items-center">
          {navItems.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={label}
                onClick={() => {
                  navigate(path);
                  setIsOpen(false); // close sidebar on mobile
                }}
                className={`flex flex-col items-center text-xs p-2 rounded hover:bg-gray-100 transition-all duration-200 ${
                  isActive ? "text-red-500 font-semibold" : "text-gray-600"
                } w-full`}
              >
                <Icon size={24} />

                {/* Label: mobile below icon, desktop beside icon */}
                <span className="mt-1 text-[10px] text-center md:mt-0 md:ml-2 md:text-sm md:block">
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            navigate("/driver/login");
            setIsOpen(false);
          }}
          className="flex flex-col items-center text-xs text-gray-600 hover:text-red-500 p-2 rounded transition-all duration-200 w-full"
        >
          <FiLogOut size={20} />
          <span className="mt-1 text-[10px] text-center md:mt-0 md:ml-2 md:text-sm md:block">
            Logout
          </span>
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
        ></div>
      )}
    </>
  );
};

export default DriverSidebar;
