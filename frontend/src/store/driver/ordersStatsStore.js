import { create } from "zustand";
import { fetchDriverOrdersAPI } from "../../api/driver/ordersStats";

const useDriverOrdersStore = create((set) => ({
  driverId: null,
  orders: [],
  loading: true,
  error: "",

  setDriverId: (id) => set({ driverId: id }),

  loadOrders: async (driverId) => {
    set({ loading: true, error: "" });
    try {
      const orders = await fetchDriverOrdersAPI(driverId);
      set({ orders, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

export default useDriverOrdersStore;
