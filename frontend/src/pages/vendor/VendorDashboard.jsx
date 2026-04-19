import React from 'react';
import { useGetVendorAnalyticsQuery, useGetVendorOrdersQuery, useUpdateItemStatusMutation } from '../../features/api/vendorApi';
import { Store, Package, TrendingUp, Archive } from 'lucide-react';

const VendorDashboard = () => {
  const { data: analyticsData, isLoading: loadingStats } = useGetVendorAnalyticsQuery();
  const { data: ordersData, isLoading: loadingOrders } = useGetVendorOrdersQuery();
  const [updateStatus] = useUpdateItemStatusMutation();

  const handleStatusChange = async (orderId, itemId, status) => {
    try {
      await updateStatus({ orderId, itemId, status }).unwrap();
      alert('Status updated successfully');
    } catch (err) {
      alert(err.data?.message || 'Failed to update status');
    }
  };

  if (loadingStats || loadingOrders) return <div className="p-20 text-center">Loading Vendor Data...</div>;

  const stats = analyticsData?.data;
  const orders = ordersData?.data?.orders || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black flex items-center"><Store className="mr-3 w-8 h-8 text-primary-600" /> Vendor Portal</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded font-semibold hover:bg-primary-700">
          + Add New Product
        </button>
      </div>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Archive className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 font-medium">Total Products</p><p className="text-2xl font-bold">{stats?.totalProducts || 0}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 font-medium">Total Revenue</p><p className="text-2xl font-bold">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Package className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 font-medium">Total Orders</p><p className="text-2xl font-bold">{stats?.totalOrders || 0}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><Package className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 font-medium">Pending Fulfillment</p><p className="text-2xl font-bold">{stats?.pendingOrders || 0}</p></div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Recent Fulfillment Needs (Your Items)</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No active orders found for your products.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Update</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.flatMap(order => 
                // Only map items belonging to the vendor (the API already filters, but verifying logic)
                order.items.map(item => (
                  <tr key={`${order._id}-${item._id}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">..{order._id.slice(-6)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">..{item.product.slice(-6)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.itemStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                        item.itemStatus === 'shipped' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.itemStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select 
                        value={item.itemStatus} 
                        onChange={(e) => handleStatusChange(order._id, item._id, e.target.value)}
                        className="border border-gray-300 rounded text-sm p-1"
                        disabled={item.itemStatus === 'delivered' || item.itemStatus === 'cancelled'}
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
