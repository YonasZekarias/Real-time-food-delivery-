import { create } from "zustand";

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,

  // Fetch all orders
  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      set({ orders: data, loading: false });
    } catch (err) {
      console.error(err);
      set({ error: "Failed to fetch orders", loading: false });
    }
  },

  // Update an order's status
  updateOrderStatus: async (id, status) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updatedOrder = await res.json();
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  // Delete an order
  deleteOrder: async (id) => {
    try {
      await fetch(`/api/orders/${id}`, { method: "DELETE" });
      set((state) => ({
        orders: state.orders.filter((o) => o.id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },
}));
