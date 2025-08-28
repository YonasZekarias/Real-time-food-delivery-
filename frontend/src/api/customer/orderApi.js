const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/delivery";

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // This sends HttpOnly cookies automatically
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create order");
  }

  return response.json();
};

export const getOrderHistory = async (page = 1, limit = 10) => {
  const response = await fetch(`${API_URL}/orders/all?page=${page}&limit=${limit}`, {
    method: "GET",
    credentials: "include", // This sends HttpOnly cookies automatically
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch order history");
  }

  return response.json();
};
