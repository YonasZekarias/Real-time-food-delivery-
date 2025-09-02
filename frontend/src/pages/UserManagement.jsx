import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; // ✅ import sidebar

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("customer");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const url = `http://localhost:5000/api/delivery/admin/users?role=${activeTab}`;
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setUsers(data?.users || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [activeTab]);

  const handleSuspendUser = async (userId) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user._id === userId
              ? { ...user, isVerified: !user.isVerified }
              : user
          )
        );
        alert(`User status updated successfully`);
      } else {
        throw new Error("Failed to update user status");
      }
    } catch (err) {
      alert(`Error updating user status: ${err.message}`);
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        alert(`User removed successfully`);
      } else {
        throw new Error("Failed to remove user");
      }
    } catch (err) {
      alert(`Error removing user: ${err.message}`);
    }
  };

  const filteredUsers =
    activeTab === "all" ? users : users.filter((user) => user.role === activeTab);

  const tabs = [
    { id: "customer", label: "Customers" },
    { id: "driver", label: "Drivers" },
    { id: "restaurant", label: "Restaurants" },
    { id: "admin", label: "Admins" },
  ];

  if (loading) return <div className="ml-20 sm:ml-24 p-6">Loading users...</div>;
  if (error) return <div className="ml-20 sm:ml-24 p-6 text-red-500">Error: {error}</div>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex">
      {/* ✅ Sidebar on the left */}
      <Sidebar />

      {/* ✅ Main content shifted right */}
      <div className="flex-1 ml-20 sm:ml-24 p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">User Management</h1>

          {/* Tabs */}
          <div className="flex border-b mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-b-2 border-red-500 text-red-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Registration Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                          user.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isVerified ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleSuspendUser(user._id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        {user.isVerified ? "Suspend" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleRemoveUser(user._id)}
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

export default UserManagement;
