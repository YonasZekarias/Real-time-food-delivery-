import { create } from "zustand";
import api from "../../api/restaurant/api";

export const useInventoryStore = create((set) => ({
  inventory: [],
  loading: false,
  error: null,

  fetchInventory: async (restaurantId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/${restaurantId}/menu`);
      const inventory = response.data.map((item) => ({
        id: item._id,
        name: item.name,
        stock: item.quantity || 0,
        available: item.inStock,
      }));
      set({ inventory, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch inventory", loading: false });
    }
  },

  updateStock: async (restaurantId, menuItemId, quantity) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/${restaurantId}/inventory`, {
        menuItemId,
        quantity,
      });

      const updatedItem = response.data.updatedItem;

      set((state) => ({
        inventory: state.inventory.map((item) =>
          item.id === menuItemId
            ? {
                ...item,
                stock: updatedItem.quantity,
                available: updatedItem.inStock,
              }
            : item
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update stock", loading: false });
    }
  },

  markUnavailable: async (restaurantId, menuItemId) => {
    const { updateStock } = useInventoryStore.getState();
    await updateStock(restaurantId, menuItemId, 0);
  },
}));
