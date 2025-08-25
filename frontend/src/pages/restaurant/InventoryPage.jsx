import { useEffect, useState } from "react";
import { useInventoryStore } from "../../store/restaurant/inventoryStore";

function Inventory() {
  const {
    inventory,
    fetchInventory,
    updateStock,
    markUnavailable,
    loading,
    error,
  } = useInventoryStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newStock, setNewStock] = useState(0);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleUpdateClick = (item) => {
    setCurrentItem(item);
    setNewStock(item.stock);
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    if (newStock !== null && !isNaN(newStock)) {
      updateStock(currentItem.id, parseInt(newStock, 10));
      setIsModalOpen(false);
      setCurrentItem(null);
    }
  };

  return (
    <div className="px-4 py-6 sm:ml-24 ml-20">
      <h1 className="text-2xl font-bold text-black mb-4">
        Inventory Management
      </h1>

      {/* Loading/Error */}
      {loading && <p className="text-black/60">Loading inventory...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-[#FF0000] text-white">
              <th className="px-4 py-2 text-left">Item</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Available</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.stock}</td>
                <td className="px-4 py-2">{item.available ? "✅" : "❌"}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleUpdateClick(item)}
                    className="bg-[#FF0000] hover:bg-[#FFD700] text-white rounded px-3 py-1 transition-colors duration-300"
                  >
                    Update Stock
                  </button>
                  <button
                    onClick={() => markUnavailable(item.id)}
                    className="bg-gray-400 hover:bg-gray-500 text-white rounded px-3 py-1 transition-colors duration-300"
                  >
                    Mark Unavailable
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Stock Modal */}
      {isModalOpen && currentItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg border">
            <h2 className="text-xl font-semibold mb-4">
              Update Stock for {currentItem.name}
            </h2>
            <div className="space-y-4">
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="w-full border border-black/20 rounded p-2"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
