import { create } from "zustand";
import { fetchOrders, fetchActiveDrivers, assignDriver } from "../../api/restaurant/assignDriver";
import toast from "react-hot-toast";

const useAssignDriverStore = create((set, get) => ({
  orders: [],
  drivers: [],
  loading: false,
  assigning: false,
  error: null,

  // ---- Fetch data ----
  loadData: async (restaurantId) => {
    if (!restaurantId) return;
    set({ loading: true, error: null });

    try {
      const [orders, drivers] = await Promise.all([
        fetchOrders(restaurantId),
        fetchActiveDrivers(restaurantId),
      ]);
      set({ orders, drivers });
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error(err.response?.data?.message || "Failed to load data");
      set({ error: err.message || "Failed to load data" });
    } finally {
      set({ loading: false });
    }
  },

  // ---- Assign driver ----
  assignToOrder: async (orderId, driverId) => {
    if (!driverId) {
      toast.error("Please select a driver");
      return;
    }

    set({ assigning: true });
    try {
      const res = await assignDriver(orderId, driverId);
      toast.success(res.message || "Driver assigned");

      // update local state
      set({
        orders: get().orders.map((o) =>
          o._id === orderId ? { ...o, driverId } : o
        ),
      });
    } catch (err) {
      console.error("Error assigning driver:", err);
      toast.error(err.response?.data?.message || "Failed to assign driver");
    } finally {
      set({ assigning: false });
    }
  },
}));

export default useAssignDriverStore;
