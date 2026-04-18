import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Marketplace</h3>
          <p className="text-sm text-gray-400">
            The premier multi-vendor platform for your shopping needs.
            University SESD Project ensuring standard code practices and layered architecture.
          </p>
        </div>
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/products" className="hover:text-white transition">All Products</a></li>
            <li><a href="/login" className="hover:text-white transition">Sign In</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Contact</h3>
          <p className="text-sm text-gray-400">Email: abstract@marketplace.com</p>
          <p className="text-sm text-gray-400 mt-2">Built with React, Redux RTK, Tailwind & Node.js</p>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Marketplace. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
