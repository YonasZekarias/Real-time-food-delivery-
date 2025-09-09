// src/store/restaurant/orderStore.js
import { create } from "zustand";
import { fetchRestaurantOrders, updateOrderStatus } from "../../api/restaurant/orders";
import useAuthStore from "./authStore";

const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    const { restaurantId } = useAuthStore.getState();
    if (!restaurantId) return;

    set({ loading: true, error: null });
    try {
      const data = await fetchRestaurantOrders(restaurantId);
      set({ orders: data.orders || [] });
    } catch (err) {
      set({ orders: [], error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updateStatus: async (orderId, newStatus) => {
    try {
      const data = await updateOrderStatus(orderId, newStatus);
      const updatedFields = data.data || {};

      set((state) => ({
        orders: state.orders.map((o) =>
          o._id === orderId ? { ...o, ...updatedFields, customerId: o.customerId } : o
        ),
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  cancelOrder: async (orderId) => {
    await get().updateStatus(orderId, "canceled");
  },
}));

export default useOrderStore;
