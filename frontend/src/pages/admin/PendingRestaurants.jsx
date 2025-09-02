import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/siderbar";

const PendingRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingRestaurants = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/restaurants/pending");
        const data = await response.json();
        setRestaurants(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch pending restaurants");
        setLoading(false);
      }
    };

    fetchPendingRestaurants();
  }, []);

  const handleApproveRestaurant = async (restaurantId) => {
    try {
      const response = await fetch(
        `/api/admin/restaurants/${restaurantId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Remove the approved restaurant from the local state
        setRestaurants(
          restaurants.filter((restaurant) => restaurant._id !== restaurantId)
        );
        alert(`Restaurant approved successfully`);
      } else {
        throw new Error("Failed to approve restaurant");
      }
    } catch (err) {
      alert(`Error approving restaurant: ${err.message}`);
    }
  };

  const handleRejectRestaurant = async (restaurantId) => {
    if (!window.confirm("Are you sure you want to reject this restaurant?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/restaurants/${restaurantId}/reject`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove the rejected restaurant from the local state
        setRestaurants(
          restaurants.filter((restaurant) => restaurant._id !== restaurantId)
        );
        alert(`Restaurant rejected successfully`);
      } else {
        throw new Error("Failed to reject restaurant");
      }
    } catch (err) {
      alert(`Error rejecting restaurant: ${err.message}`);
    }
  };

  if (loading) return <div className="p-6">Loading pending restaurants...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">
            Pending Restaurant Approvals
          </h1>

          {/* Pending Restaurants Table */}
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
                    Submitted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                      <div className="text-sm text-gray-500">
                        {new Date(restaurant.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleApproveRestaurant(restaurant._id)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRestaurant(restaurant._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
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

export default PendingRestaurants;
