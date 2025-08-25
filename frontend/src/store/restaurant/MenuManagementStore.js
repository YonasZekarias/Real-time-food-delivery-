import { create } from "zustand";

export const useMenuManagementStore = create((set) => ({
  menuItems: [],
  loading: false,
  error: null,

  // Fetch all menu items
  fetchMenu: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      set({ menuItems: data, loading: false });
    } catch (err) {
      console.error(err);
      set({ error: "Failed to fetch menu", loading: false });
    }
  },

  // Add new menu item
  addMenu: async (item) => {
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const newItem = await res.json();
      set((state) => ({ menuItems: [...state.menuItems, newItem] }));
    } catch (err) {
      console.error(err);
    }
  },

  // Update an item
  updateMenu: async (id, updated) => {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const updatedItem = await res.json();
      set((state) => ({
        menuItems: state.menuItems.map((m) => (m.id === id ? updatedItem : m)),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  // Delete an item
  deleteMenu: async (id) => {
    try {
      await fetch(`/api/menu/${id}`, { method: "DELETE" });
      set((state) => ({
        menuItems: state.menuItems.filter((m) => m.id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },
}));
