import React, { useState } from "react";
import useAuthStore from "../store/customer/authStore";

const UserMenu = () => {
  const { user, logout } = useAuthStore(); 
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout?.();
    window.location.href = "/login";
  };

  // Get first letter of user's name for avatar
  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="relative w-full flex justify-center">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-white font-semibold text-lg hover:brightness-90"
      >
        {/* Avatar: either image or first letter */}
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
        ) : (
          firstLetter
        )}
      </button>

      {open && (
        <div className="absolute bottom-14 left-0 w-48 p-4 bg-white shadow-md rounded-md border">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <button
            onClick={handleLogout}
            className="mt-3 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
