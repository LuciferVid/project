import React from 'react';
import { useGetMyOrdersQuery, useCancelOrderMutation } from '../../features/api/orderApi';
import { Package, ExternalLink } from 'lucide-react';

const CustomerOrders = () => {
  const { data, isLoading } = useGetMyOrdersQuery();
  const [cancelOrder] = useCancelOrderMutation();

  const handleCancel = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrder(orderId).unwrap();
        alert('Order cancelled successfully.');
      } catch (err) {
        alert(err.data?.message || 'Could not cancel order');
      }
    }
  };

  if (isLoading) return <div className="p-20 text-center">Loading orders...</div>;
  const orders = data?.data?.orders || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black mb-8 flex items-center"><Package className="mr-3 w-8 h-8 text-primary-600" /> My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-4 text-lg">You have no active orders.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-100">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mr-4">Order Placed</span>
                  <p className="font-semibold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mr-4">Total Amount</span>
                  <p className="font-semibold text-lg text-primary-600">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="mt-2 sm:mt-0 flex">
                   <div className="mr-4">
                     <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Status</span>
                     <p className={`font-semibold text-sm capitalize ${
                       order.status === 'delivered' ? 'text-green-600' : 
                       order.status === 'cancelled' ? 'text-red-500' : 'text-blue-600'
                     }`}>
                       {order.status}
                     </p>
                   </div>
                   {(order.status === 'placed' || order.status === 'confirmed') && (
                     <button onClick={() => handleCancel(order._id)} className="text-sm text-red-500 hover:underline">Cancel</button>
                   )}
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={item._id || idx} className="flex justify-between items-center py-2">
                       <div className="flex">
                         <div className="ml-4">
                           <h4 className="font-semibold text-gray-900">Product ID: {item.product}</h4>
                           <p className="text-sm text-gray-500">Qty: {item.quantity} | Item Status: <span className="font-medium text-gray-700 capitalize">{item.itemStatus}</span></p>
                         </div>
                       </div>
                       <div className="font-medium text-gray-900 border px-3 py-1 rounded bg-gray-50">
                         ₹{item.priceAtTime * item.quantity}
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
