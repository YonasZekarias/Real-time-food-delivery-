import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useInventoryStore } from "../../store/restaurant/inventoryStore";
import Sidebar from "../../components/restaurant/Sidebar";

function Inventory() {
  const { restaurantId } = useParams();
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
    if (restaurantId) {
      console.log("Fetching inventory...");
      fetchInventory(restaurantId);
    }
  }, [fetchInventory, restaurantId]);

  const handleUpdateClick = (item) => {
    setCurrentItem(item);
    setNewStock(item.stock);
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    if (newStock !== null && !isNaN(newStock)) {
      updateStock(restaurantId, currentItem.id, parseInt(newStock, 10));
      setIsModalOpen(false);
      setCurrentItem(null);
    }
  };

  const handleMarkUnavailable = (itemId) => {
    markUnavailable(restaurantId, itemId);
  };

  return (
    <div className="relative flex min-h-screen bg-white">
      {/* Animated Background Orbs */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#FFD700] rounded-full filter blur-[150px] opacity-20 z-0"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#FF0000] rounded-full filter blur-[150px] opacity-20 z-0"></div>

      <Sidebar />
      <div className="relative flex-1 px-4 py-6 sm:ml-24 ml-20 z-10">
        <h1 className="text-3xl font-bold text-[#FF0000] mb-6">
          Inventory Management
        </h1>

        {/* Loading/Error */}
        {loading && (
          <p className="text-black/60 text-lg">Loading inventory...</p>
        )}
        {error && <p className="text-[#FF0000] font-medium">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full bg-black/5 backdrop-blur-sm border border-black/10 rounded-2xl shadow-lg">
            <thead>
              <tr className="bg-[#FF0000] text-white">
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-black/10 hover:bg-[#FFD700]/10 transition-all duration-300"
                >
                  <td className="px-6 py-4 text-black/80">{item.name}</td>
                  <td className="px-6 py-4 text-black/80">
                    {item.stock} items
                  </td>
                  <td className="px-6 py-4">{item.available ? "✅" : "❌"}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
                      <button
                        onClick={() => handleUpdateClick(item)}
                        className="bg-[#FF0000] hover:bg-[#FFD700] text-white font-medium rounded-lg px-4 py-2 transition-all duration-300"
                      >
                        Update Stock
                      </button>
                      <button
                        onClick={() => handleMarkUnavailable(item.id)}
                        className="bg-black/10 hover:bg-[#FF0000]/20 text-black/80 hover:text-[#FF0000] font-medium rounded-lg px-4 py-2 transition-all duration-300"
                      >
                        Mark Unavailable
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Update Stock Modal */}
        {isModalOpen && currentItem && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white/80 backdrop-blur-sm border border-black/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-semibold text-[#FF0000] mb-6">
                Update Stock for {currentItem.name}
              </h2>
              <div className="space-y-4">
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full border border-black/20 rounded-lg p-3 text-black/80 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all duration-300"
                  placeholder="Enter new stock"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-black/70 hover:text-[#FF0000] font-medium transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-[#FF0000] hover:bg-[#FFD700] text-white font-medium px-6 py-2 rounded-lg transition-all duration-300"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;
