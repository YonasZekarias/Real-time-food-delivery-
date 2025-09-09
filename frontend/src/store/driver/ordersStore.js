import { create } from "zustand";
import {
  fetchDriverOrdersAPI,
  updateDriverStatusAPI,
  updateOrderStatusAPI,
} from "../../api/driver/orders";

const useDriverOrdersStore = create((set, get) => ({
  driver: null,
  orders: [],
  loading: false,
  error: "",
  updatingStatus: false,

  loadDriverOrders: async (driverId) => {
    set({ loading: true, error: "" });
    try {
      const data = await fetchDriverOrdersAPI(driverId);
      set({ driver: data.driver, orders: data.orders, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  toggleDriverAvailability: async () => {
    const { driver } = get();
    if (!driver) return;

    set({ updatingStatus: true, error: "" });
    try {
      const newStatus = driver.status === "available" ? "unavailable" : "available";
      const updatedDriver = await updateDriverStatusAPI(newStatus);
      set({ driver: updatedDriver, updatingStatus: false });
    } catch (err) {
      set({ error: err.message, updatingStatus: false });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    set({ error: "" });
    try {
      await updateOrderStatusAPI(orderId, status);
      set((state) => ({
        orders: state.orders.map((o) =>
          o._id === orderId ? { ...o, status } : o
        ),
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },
}));

export default useDriverOrdersStore;
