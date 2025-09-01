// src/api/restaurant/menuApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/delivery/restaurants",
  withCredentials: true, // ✅ send HttpOnly cookie automatically
});

// GET all menu items
export const fetchMenuApi = async (restaurantId) => {
  const res = await api.get(`/${restaurantId}/menu`);
  return res.data;
};

// CREATE new menu item
export const createMenuItemApi = async (restaurantId, item) => {
  const res = await api.post(`/${restaurantId}/menu`, item);
  return res.data;
};

// UPDATE a menu item
export const updateMenuItemApi = async (restaurantId, itemId, item) => {
  const res = await api.put(`/${restaurantId}/menu/${itemId}`, item);
  return res.data;
};

// DELETE a menu item
export const deleteMenuItemApi = async (restaurantId, itemId) => {
  const res = await api.delete(`/${restaurantId}/menu/${itemId}`);
  return res.data;
};
