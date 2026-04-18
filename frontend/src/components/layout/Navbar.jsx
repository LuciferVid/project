import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { selectCurrentUser, logout } from '../../features/auth/authSlice';
import { useLogoutMutation } from '../../features/auth/authApi';

const Navbar = () => {
  const user = useSelector(selectCurrentUser);
  const [logoutApi] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed: ', err);
      // Force local logout anyway
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 tracking-tight">
              Marketplace
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/products" className="text-gray-600 hover:text-primary-600 font-medium">Explore</Link>
            
            {user ? (
              <>
                {user.role === 'customer' && (
                  <Link to="/cart" className="text-gray-600 hover:text-primary-600 relative">
                    <ShoppingCart className="w-6 h-6" />
                    {/* Placeholder cart badge */}
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
                  </Link>
                )}
                
                <div className="flex items-center space-x-4 border-l pl-4">
                  <span className="font-medium text-gray-700 capitalize flex items-center gap-2">
                    <User className="w-4 h-4"/> {user.name} ({user.role})
                  </span>
                  
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard" className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Admin</Link>
                  )}
                  {user.role === 'vendor' && (
                    <Link to="/vendor/dashboard" className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Vendor Portal</Link>
                  )}
                  {user.role === 'customer' && (
                    <Link to="/orders" className="text-sm text-gray-600 hover:text-primary-600">My Orders</Link>
                  )}

                  <button 
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600 flex items-center p-2 rounded-full hover:bg-red-50 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                <Link to="/login" className="text-gray-600 font-medium hover:text-primary-600">Log In</Link>
                <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
