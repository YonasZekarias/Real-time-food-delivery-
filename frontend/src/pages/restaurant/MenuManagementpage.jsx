import { useEffect, useState } from "react";
import { useMenuManagementStore } from "../../store/restaurant/MenuManagementStore";

function MenuManagement() {
  const {
    menuItems,
    fetchMenu,
    addMenu,
    deleteMenu,
    updateMenu,
    loading,
    error,
  } = useMenuManagementStore();
  const [form, setForm] = useState({ name: "", price: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const handleAdd = () => {
    if (!form.name || !form.price) return;
    addMenu(form);
    setForm({ name: "", price: "" });
  };

  const handleEditClick = (item) => {
    setCurrentEdit(item);
    setIsEditing(true);
  };

  const handleUpdate = () => {
    if (!currentEdit.name || !currentEdit.price) return;
    updateMenu(currentEdit.id, {
      name: currentEdit.name,
      price: currentEdit.price,
    });
    setIsEditing(false);
    setCurrentEdit(null);
  };

  return (
    <div className="px-4 py-6 sm:ml-24 ml-20">
      <h1 className="text-2xl font-bold text-black mb-4">Menu Management</h1>

      {/* Form */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Item Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-black/20 rounded p-2 flex-grow"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border border-black/20 rounded p-2"
        />
        <button
          onClick={handleAdd}
          className="bg-[#FF0000] hover:bg-[#FFD700] text-white rounded px-4 py-2 transition-colors duration-300"
        >
          Add Item
        </button>
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-black/60">Loading menu...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Menu Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-[#FF0000] text-white">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">Br{item.price}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMenu(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditing && currentEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg border">
            <h2 className="text-xl font-semibold mb-4">Edit Menu Item</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={currentEdit.name}
                onChange={(e) =>
                  setCurrentEdit({ ...currentEdit, name: e.target.value })
                }
                className="w-full border border-black/20 rounded p-2"
              />
              <input
                type="number"
                value={currentEdit.price}
                onChange={(e) =>
                  setCurrentEdit({ ...currentEdit, price: e.target.value })
                }
                className="w-full border border-black/20 rounded p-2"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
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

export default MenuManagement;
