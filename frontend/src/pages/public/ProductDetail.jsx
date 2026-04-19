import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../features/api/productApi';
import { useAddToCartMutation } from '../../features/api/cartApi';
import { ShoppingBag, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  
  const { data, isLoading, isError } = useGetProductByIdQuery(id);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  
  const [quantity, setQuantity] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');

  const product = data?.data?.product;

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }
    
    try {
      await addToCart({ productId: id, quantity }).unwrap();
      setSuccessMsg('Added to cart successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.data?.message || 'Failed to add to cart');
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-b-2 border-primary-600 rounded-full"></div></div>;
  if (isError || !product) return <div className="text-center py-20 text-red-500">Error loading product details.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* Image Gallery (Simplified to First image) */}
          <div className="bg-gray-50 flex items-center justify-center p-8 border-r border-gray-100">
            {product.images?.[0] ? (
              <img src={product.images[0].url} alt={product.name} className="max-h-[500px] object-contain drop-shadow-md rounded" />
            ) : (
              <div className="h-96 w-full flex items-center justify-center bg-gray-200">No Image Available</div>
            )}
          </div>
          
          {/* Detailed Info */}
          <div className="p-8 md:p-12 flex flex-col">
            <div className="mb-2 text-primary-600 text-sm font-semibold tracking-wide uppercase">
              {product.category?.name || 'General'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center text-yellow-500">
                ★★★★★ <span className="text-gray-600 ml-2 font-medium">{product.averageRating || '0.0'} ({product.totalReviews || 0} reviews)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">Brand: <span className="font-medium text-gray-800">{product.brand || 'Generic'}</span></span>
            </div>
            
            <div className="mb-8">
              <span className="text-4xl font-black text-gray-900 tracking-tight">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice > product.price && (
                <span className="ml-3 text-lg text-gray-400 line-through font-medium">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
            
            <hr className="border-gray-100 mb-8" />
            
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              {product.description}
            </p>
            
            <div className="mt-auto">
              {successMsg && (
                <div className="mb-4 text-green-600 flex items-center bg-green-50 p-3 rounded-lg"><CheckCircle className="w-5 h-5 mr-2" /> {successMsg}</div>
              )}
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 bg-gray-50 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
                    disabled={quantity <= 1}
                  >-</button>
                  <span className="px-6 py-3 font-semibold text-gray-900 border-x border-gray-300 w-16 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-3 bg-gray-50 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
                    disabled={quantity >= product.stock}
                  >+</button>
                </div>
                
                <div className="flex-1">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || product.stock === 0 || user?.role === 'vendor' || user?.role === 'admin'}
                    className="w-full flex items-center justify-center py-4 px-8 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-6 h-6 mr-3" />
                    {isAdding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
              
              {product.stock > 0 ? (
                <div className="text-sm text-green-600 flex items-center font-medium"><CheckCircle className="w-4 h-4 mr-1.5" /> {product.stock} units in stock</div>
              ) : (
                <div className="text-sm text-red-500 flex items-center font-medium"><AlertTriangle className="w-4 h-4 mr-1.5" /> Out of stock</div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
