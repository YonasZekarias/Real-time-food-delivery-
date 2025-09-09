import axios from "axios";

const BASE_URL = "http://localhost:5000/api/delivery/customer";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ✅ Central error handler
const handleError = (err, defaultMsg) =>
  err.response?.data?.message || err.message || defaultMsg || "Something went wrong";

// ---------------- CART APIS ----------------

// Get cart
export const fetchCartApi = async () => {
  try {
    const res = await api.get("/getCart");
    return { success: true, data: res.data.data };
  } catch (err) {
    return { success: false, message: handleError(err, "Failed to load cart") };
  }
};

// Add item
export const addToCartApi = async (restaurantId, menuItemId, quantity) => {
  try {
    await api.post("/addToCart", { restaurantId, menuItemId, quantity });
    return { success: true };
  } catch (err) {
    return { success: false, message: handleError(err, "Failed to add item") };
  }
};

// Update item quantity
export const updateCartItemApi = async (cartId, quantity) => {
  try {
    await api.put(`/updateCart/${cartId}`, { quantity });
    return { success: true };
  } catch (err) {
    return { success: false, message: handleError(err, "Failed to update item") };
  }
};

// Remove single item
export const removeFromCartApi = async (cartId) => {
  try {
    await api.delete(`/removeFromCart/${cartId}`);
    return { success: true };
  } catch (err) {
    return { success: false, message: handleError(err, "Failed to remove item") };
  }
};

// Clear all items for a restaurant
export const clearCartApi = async (restaurantId) => {
  try {
    await api.delete(`/deleteCart/${restaurantId}`);
    return { success: true };
  } catch (err) {
    return { success: false, message: handleError(err, "Failed to clear cart") };
  }
};
