import React from "react";
import { FiHome, FiMap, FiShoppingBag, FiTag, FiSettings, FiShield, FiUsers, FiCheckCircle } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/customer/authStore";
import UserMenu from "../pages/UserMenu"; // import the new component

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const userNavItems = [
    { label: "Home", icon: FiHome, path: "/" },
    { label: "Explore", icon: FiMap, path: "/nearby" },
    { label: "Orders", icon: FiShoppingBag, path: "/order-history" },
    { label: "Promos", icon: FiTag, path: "/promos" },
    { label: "Setting", icon: FiSettings, path: "/settings" },
  ];

  const adminNavItems = [
   // { label: "Admin Dashboard", icon: FiShield, path: "/admin" },
    { label: "User Management", icon: FiUsers, path: "/user-management" },
   // { label: "Restaurant Management", icon: FiShoppingBag, path: "/admin/restaurants" },
   // { label: "Pending Restaurants", icon: FiCheckCircle, path: "/admin/restaurants/pending" },
  ];

  return (
    <div className="w-20 sm:w-24 bg-white border-r h-screen flex flex-col justify-between items-center py-6 gap-8 fixed left-0 top-0 z-10">
      {/* Top Section */}
      <div className="flex flex-col items-center gap-4">
        {/* Logo */}
        <img
          src="https://static.vecteezy.com/system/resources/previews/008/687/818/non_2x/food-delivery-logo-free-vector.jpg"
          alt="Logo"
          className="w-12 h-12 object-contain mb-4"
        />

        {/* Navigation Items */}
        <div className="flex flex-col gap-6">
          {userNavItems.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center text-xs ${isActive ? "text-red-500 font-semibold" : "text-gray-600"} hover:text-red-500 transition`}
              >
                <Icon size={20} />
                <span className="mt-1">{label}</span>
              </button>
            );
          })}

          {/* Admin Section */}
          {isAdmin &&
            adminNavItems.map(({ label, icon: Icon, path }) => {
              const isActive =
                location.pathname === path ||
                (path === "/admin" && location.pathname.startsWith("/admin")) ||
                (path === "/user-management" && location.pathname.startsWith("/user-management")) ||
                (path === "/admin/restaurants" && location.pathname.startsWith("/admin/restaurants"));

              return (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className={`flex flex-col items-center text-xs ${isActive ? "text-red-500 font-semibold" : "text-gray-600"} hover:text-red-500 transition`}
                >
                  <Icon size={20} />
                  <span className="mt-1">{label}</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Bottom User Menu */}
      <UserMenu />
    </div>
  );
};

export default Sidebar;
