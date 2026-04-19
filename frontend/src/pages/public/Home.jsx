import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../features/api/productApi';
import { Search, Filter } from 'lucide-react';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const { data, isLoading, isError } = useGetProductsQuery({ 
    search: debouncedSearch, 
    limit: 12 
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setDebouncedSearch(searchTerm);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero / Search Section */}
      <div className="bg-primary-600 rounded-2xl p-8 mb-10 text-white shadow-lg flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-black mb-4 tracking-tight">Discover Amazing Products</h1>
        <p className="text-primary-100 mb-8 max-w-2xl text-lg">Shop millions of high quality products mapped across independent vendors.</p>
        
        <form onSubmit={handleSearchSubmit} className="w-full max-w-lg relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for products, brands and more..."
            className="w-full pl-5 pr-12 py-4 rounded-full text-gray-900 shadow-md focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all font-medium"
          />
          <button type="submit" className="absolute right-2 top-2 p-2 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition">
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Product Grid */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold border-l-4 border-primary-600 pl-3">Featured Products</h2>
        <button className="flex items-center text-gray-600 hover:text-primary-600 transition font-medium">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center font-medium">
          Failed to load products. Ensure the backend is running perfectly on port 5000.
        </div>
      ) : data?.data?.products?.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.data.products.map((product) => (
            <Link key={product._id} to={`/products/${product._id}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col">
              <div className="aspect-square bg-gray-100 overflow-hidden relative">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0].url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                {product.stock === 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">Out of Stock</div>
                )}
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">{product.name}</h3>
                <div className="mt-2 flex items-center text-sm text-yellow-500">
                   ★ <span className="text-gray-600 ml-1">{product.averageRating || 'New'}</span>
                   <span className="text-gray-400 ml-1">({product.totalReviews || 0})</span>
                </div>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
