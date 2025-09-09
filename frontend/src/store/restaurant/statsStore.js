// src/store/restaurant/statsStore.js
import { create } from "zustand";
import { fetchRestaurantOrders, fetchRestaurantStats } from "../../api/restaurant/stats";
import useAuthStore from "./authStore";

const useStatsStore = create((set, get) => ({
  orders: [],
  stats: null,
  loading: false,
  error: null,

  loadData: async () => {
    const { restaurantId } = useAuthStore.getState();
    if (!restaurantId) return;

    set({ loading: true, error: null });
    try {
      const ordersData = await fetchRestaurantOrders(restaurantId);
      const orders = ordersData.orders || [];

      const statsData = await fetchRestaurantStats(restaurantId);

      // Calculate revenue as 5% of delivered orders
      const deliveredOrders = orders.filter((o) => o.status === "delivered");
      const revenue = deliveredOrders.reduce((acc, o) => acc + (o.total || 0) * 0.05, 0);

      set({ orders, stats: { totalOrders: statsData.totalOrders, totalRevenue: revenue } });
    } catch (err) {
      set({ orders: [], stats: null, error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useStatsStore;
