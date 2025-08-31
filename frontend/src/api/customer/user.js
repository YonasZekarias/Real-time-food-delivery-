// src/api/restaurantApi.js
export const fetchUsers = async (role) => {
  const url = "http://localhost:5000/api/delivery/admin/users";

  const response = await fetch(url, {
    method: "GET",
    credentials: "include", // ✅ send HttpOnly cookie automatically
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return await response.json();
};
