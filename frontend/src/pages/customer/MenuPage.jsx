// pages/MenuPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import useMenuStore from "../../store/customer/menuStore";
import useCartStore from "../../store/customer/cartStore";

const MenuPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const {
    restaurantName,
    menuItems,
    loading,
    error,
    fetchMenu,
    promoTopOffset,
    setPromoTopOffset,
  } = useMenuStore();

  const { addToCart, getTotalQuantity, loadCart } = useCartStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const categoriesRef = useRef(null);

  // Fetch menu and cart on mount
  useEffect(() => {
    fetchMenu(restaurantId);
    loadCart(); // load full cart from backend for cart icon
  }, [restaurantId, fetchMenu, loadCart]);

  useEffect(() => {
    if (categoriesRef.current) {
      setPromoTopOffset(categoriesRef.current.offsetTop);
    }
  }, [loading, menuItems, setPromoTopOffset]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setActiveCategory("BreakFast");
    else if (hour >= 11 && hour < 16) setActiveCategory("Lunch");
    else if (hour >= 17 && hour < 21) setActiveCategory("Dinner");
    else setActiveCategory("Desserts");
  }, []);

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCartQuantity = getTotalQuantity();

  // Handle adding item to cart and refreshing store
  const handleAddToCart = async (item) => {
    try {
      console.log("MenuPage: handleAddToCart called with:", item);
      await addToCart(item, restaurantId); // add to backend
      await loadCart(); // reload full cart
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  return (
    <div className="flex bg-white min-h-screen font-sans bg-gray-100 relative">
      {/* Sidebar */}
      <div className="w-16 md:w-20 bg-white border-r">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6" style={{ marginRight: "320px" }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-black">{restaurantName}</h1>
            <p className="text-sm text-gray-500 mt-1">{new Date().toDateString()}</p>
          </div>

          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
            />
          </div>
        </div>

        {/* Categories */}
        <div ref={categoriesRef} className="flex space-x-3 mb-6 overflow-x-auto">
          {["BreakFast", "Lunch", "Dinner", "Desserts"].map((cat, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full border text-black shadow-sm whitespace-nowrap transition-colors ${
                cat === activeCategory ? "border-red-500 bg-red-50" : "bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {loading ? (
          <p className="text-center text-gray-600">Loading menu...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredMenu.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
                onClick={() => handleAddToCart(item)}
              >
                <img
                  src={item.image || "/images/default-food.jpg"}
                  alt={item.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-gray-900 font-semibold truncate">{item.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-red-500 font-bold text-sm">${item.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">11 items</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promotions Panel */}
      <div
        className="w-80 bg-white border-l p-6 overflow-y-auto fixed right-0 top-0 h-screen"
        style={{ paddingTop: promoTopOffset }}
      >
        <h2 className="text-xl font-bold mb-4">Promotions</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800">50% Off on Burgers</h3>
            <p className="text-sm text-gray-600">
              Get half price on all burger items this weekend!
            </p>
          </div>
          <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800">Free Drink</h3>
            <p className="text-sm text-gray-600">
              Free drink with any meal over $20.
            </p>
          </div>
          <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800">Dessert Combo</h3>
            <p className="text-sm text-gray-600">
              Get dessert combo at 25% off when you order any main dish.
            </p>
          </div>
        </div>
      </div>

      {/* Cart Icon */}
      <div
        className="fixed right-6 top-6 cursor-pointer text-red-600 z-50"
        onClick={() => navigate("/cart")}
      >
        <div className="relative">
          <FaShoppingCart className="text-4xl" />
          {totalCartQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-700 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {totalCartQuantity}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
