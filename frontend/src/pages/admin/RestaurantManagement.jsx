import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/siderbar";

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/restaurants");
        const data = await response.json();
        setRestaurants(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch restaurants");
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleSuspendRestaurant = async (restaurantId) => {
    try {
      const response = await fetch(
        `/api/admin/restaurants/${restaurantId}/suspend`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Update the restaurant status in the local state
        setRestaurants(
          restaurants.map((restaurant) =>
            restaurant._id === restaurantId
              ? { ...restaurant, verified: !restaurant.verified }
              : restaurant
          )
        );
        alert(`Restaurant status updated successfully`);
      } else {
        throw new Error("Failed to update restaurant status");
      }
    } catch (err) {
      alert(`Error updating restaurant status: ${err.message}`);
    }
  };

  const handleRemoveRestaurant = async (restaurantId) => {
    if (!window.confirm("Are you sure you want to remove this restaurant?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/restaurants/${restaurantId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the restaurant from the local state
        setRestaurants(
          restaurants.filter((restaurant) => restaurant._id !== restaurantId)
        );
        alert(`Restaurant removed successfully`);
      } else {
        throw new Error("Failed to remove restaurant");
      }
    } catch (err) {
      alert(`Error removing restaurant: ${err.message}`);
    }
  };

  if (loading) return <div className="p-6">Loading restaurants...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">Restaurant Management</h1>

          {/* Restaurants Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Restaurant Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restaurants.map((restaurant) => (
                  <tr key={restaurant._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {restaurant.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {restaurant.ownerId?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {restaurant.ownerId?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          restaurant.verified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {restaurant.verified ? "Approved" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          restaurant.verified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {restaurant.verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleSuspendRestaurant(restaurant._id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        {restaurant.verified ? "Suspend" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleRemoveRestaurant(restaurant._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantManagement;
