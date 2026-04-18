import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation } from '../../features/api/cartApi';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { data, isLoading } = useGetCartQuery();
  const [updateItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeItem, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const navigate = useNavigate();

  const cart = data?.data?.cart;

  const handleUpdateQty = async (productId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty < 1) return;
    try {
      await updateItem({ productId, quantity: newQty }).unwrap();
    } catch (err) {
      alert(err.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId).unwrap();
    } catch (err) {
      alert(err.data?.message || 'Failed to remove item');
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-b-2 border-primary-600 rounded-full"></div></div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <ShoppingBag className="w-20 h-20 text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition">Start Shopping</Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((acc, item) => acc + (item.priceAtTime * item.quantity), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {cart.items.map((item) => (
                <li key={item.product._id} className="p-6 flex flex-col sm:flex-row gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.images?.[0]?.url || 'https://via.placeholder.com/150'} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <Link to={`/products/${item.product._id}`} className="text-lg font-semibold text-gray-900 hover:text-primary-600 line-clamp-1">
                        {item.product.name}
                      </Link>
                      <span className="font-bold text-gray-900">₹{(item.priceAtTime * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">₹{item.priceAtTime.toLocaleString('en-IN')} each</p>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                        <button 
                          onClick={() => handleUpdateQty(item.product._id, item.quantity, -1)}
                          disabled={isUpdating}
                          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 text-gray-600 font-medium"
                        >-</button>
                        <span className="px-4 py-1 text-sm font-semibold border-x border-gray-300 bg-white">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQty(item.product._id, item.quantity, 1)}
                          disabled={isUpdating}
                          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 text-gray-600 font-medium"
                        >+</button>
                      </div>
                      
                      <button 
                        onClick={() => handleRemove(item.product._id)}
                        disabled={isRemoving}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.items.length} items)</span>
                <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Estimate</span>
                <span className="font-medium text-gray-900">₹{subtotal > 500 ? 'Free' : '50'}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-xl font-black text-gray-900">₹{(subtotal + (subtotal > 500 ? 0 : 50)).toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Taxes included. Discounts applied at checkout.</p>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition"
            >
              Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
