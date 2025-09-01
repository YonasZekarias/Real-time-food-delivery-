import React, { useState, useEffect } from "react";
import Sidebar from "../../components/restaurant/Sidebar";
import OrderStatus from "../../components/OrderStatus";
import Graphs from "../../components/Graphs";
import dummyOrders from "../../data/dummyOrders";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [modalOrder, setModalOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("status");

  useEffect(() => {
    const fetched = dummyOrders.map(order => ({
      ...order,
      total: order.items.reduce((sum, i) => sum + i.qty * i.price, 0)
    }));
    setOrders(fetched);
  }, []);

  const grouped = { pending: [], "in-progress": [], completed: [] };
  orders.forEach(o => grouped[o.status].push(o));

  const formatBirr = (x) => "Br " + (x || 0).toLocaleString();

  const updateStatus = (order, newStatus) => {
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
    setModalOrder(null);
  };

  const deleteOrder = (order) => {
    setOrders(prev => prev.filter(o => o.id !== order.id));
    setModalOrder(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar active={activeTab} setActive={setActiveTab} />

      {/* Main */}
      <div className="flex-1 p-6 ml-20">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-gray-50 pb-4 z-40">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              Bonali Burger & Pizza Dashboard
            </h1>
            <span className="text-sm text-gray-500">Welcome back, Owner</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b">
            <button
              onClick={() => setActiveTab("status")}
              className={`pb-2 text-sm font-medium transition ${
                activeTab === "status"
                  ? "border-b-2 border-red-500 text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("graph")}
              className={`pb-2 text-sm font-medium transition ${
                activeTab === "graph"
                  ? "border-b-2 border-red-500 text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Graphs
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "status" && (
          <OrderStatus
            orders={orders}
            grouped={grouped}
            setModalOrder={setModalOrder}
            formatBirr={formatBirr}
          />
        )}
        {activeTab === "graph" && <Graphs orders={orders} grouped={grouped} />}

        {/* Modal */}
        {modalOrder && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-lg border border-gray-200">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-lg text-gray-800">
                  Order #{modalOrder.id}
                </h2>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setModalOrder(null)}
                >
                  ✕
                </button>
              </div>

              {/* Customer Info */}
              <div className="mb-6">
                <p className="text-gray-800 font-medium">
                  {modalOrder.customer}
                </p>
                <p className="text-sm text-gray-500">Customer</p>
              </div>

              {/* Table */}
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden mb-6">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 text-left font-medium">Item</th>
                    <th className="p-3 text-center font-medium">Qty</th>
                    <th className="p-3 text-right font-medium">Price</th>
                    <th className="p-3 text-right font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {modalOrder.items.map((i, idx) => (
                    <tr
                      key={idx}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{i.name}</td>
                      <td className="p-3 text-center">{i.qty}</td>
                      <td className="p-3 text-right">{formatBirr(i.price)}</td>
                      <td className="p-3 text-right">{formatBirr(i.qty * i.price)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className=" font-medium">
                    <td colSpan={3} className="p-3 text-right">
                      Total
                    </td>
                    <td className="p-3 text-right">{formatBirr(modalOrder.total)}</td>
                  </tr>
                </tfoot>
              </table>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                {modalOrder.status === "pending" && (
                  <button
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm"
                    onClick={() => updateStatus(modalOrder, "in-progress")}
                  >
                    Mark as Preparing
                  </button>
                )}
                {modalOrder.status === "in-progress" && (
                  <button
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm"
                    onClick={() => updateStatus(modalOrder, "completed")}
                  >
                    Mark as Completed
                  </button>
                )}
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                  onClick={() => deleteOrder(modalOrder)}
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
