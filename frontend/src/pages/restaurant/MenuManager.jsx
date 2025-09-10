import { useEffect, useState } from "react";
import Sidebar from "../../components/restaurant/Sidebar";
import useMenuStore from "../../store/restaurant/restaurantMenu";

export default function MenuPage() {
  const {
    menuItems,
    fetchMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    loading,
  } = useMenuStore();

  const initialFormState = {
    name: "",
    price: "",
    description: "",
    image: "",
    inStock: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const openForm = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData(initialFormState);
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setEditingItem(null);
    setFormData(initialFormState);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await updateMenuItem(editingItem._id, formData);
    } else {
      await addMenuItem(formData);
      await fetchMenu(); // Refresh immediately
    }
    closeForm();
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div
        className={`p-6 w-full transition-all duration-300
          ${sidebarOpen ? "ml-64" : "ml-0"} sm:ml-24`}
      >
        <h1 className="text-2xl font-bold mb-4">Restaurant Menu</h1>

        <button
          onClick={() => openForm()}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Create New Item
        </button>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border rounded-lg shadow-lg bg-white animate-pulse h-[250px]"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
            {menuItems.length === 0 ? (
              <p>No items available.</p>
            ) : (
              menuItems.map((item) => (
                <div
                  key={item._id}
                  className={`border rounded-lg shadow-lg bg-white flex flex-col ${
                    item.pending ? "opacity-70 animate-pulse" : ""
                  }`}
                >
                  <img
                    src={item.image || "https://via.placeholder.com/400x250"}
                    alt={item.name}
                    className="w-full h-[158px] object-cover rounded-t-lg"
                  />
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-col">
                        <p className="font-semibold text-lg">{item.name}</p>
                        <p className="text-sm text-gray-700">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-gray-500 text-sm">${item.price}</p>
                        <p className="text-sm mt-1">
                          {item.inStock ? "✅ Stock" : "❌ Out of Stock"}
                        </p>
                      </div>
                    </div>

                    {item.pending && (
                      <span className="text-blue-500 text-sm">Saving...</span>
                    )}

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => openForm(item)}
                        className="bg-yellow-400 text-white px-4 py-2 rounded flex-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMenuItem(item._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded flex-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">
              {editingItem ? "Edit Item" : "Create New Item"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border px-2 py-1 w-full"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="border px-2 py-1 w-full"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border px-2 py-1 w-full"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="border px-2 py-1 w-full"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) =>
                    setFormData({ ...formData, inStock: e.target.checked })
                  }
                />
                In Stock
              </label>

              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {editingItem ? "Update Item" : "Add Item"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
