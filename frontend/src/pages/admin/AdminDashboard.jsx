import React from 'react';
import { useGetAdminDashboardQuery, useGetAdminVendorsQuery, useApproveVendorMutation, useRejectVendorMutation } from '../../features/api/adminApi';
import { ShieldAlert, Users, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { data: dashboardData, isLoading } = useGetAdminDashboardQuery();
  const { data: vendorsData, isLoading: loadingVendors } = useGetAdminVendorsQuery();
  
  const [approveVendor] = useApproveVendorMutation();
  const [rejectVendor] = useRejectVendorMutation();

  const handleApprove = async (id) => {
    try {
      await approveVendor(id).unwrap();
    } catch(err) {
      alert("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectVendor(id).unwrap();
    } catch (err) {
      alert("Failed to reject");
    }
  }

  if (isLoading || loadingVendors) return <div className="p-20 text-center">Loading Admin Panel...</div>;

  const stats = dashboardData?.data;
  const vendors = vendorsData?.data?.vendors || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black mb-8 flex items-center"><ShieldAlert className="mr-3 w-8 h-8 text-red-600" /> Admin Command Center</h1>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 border-t-4 border-t-blue-500">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 font-medium">Total Users</p><p className="text-2xl font-bold">{stats?.usersCount || 0}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 border-t-4 border-t-green-500">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 font-medium">Platform Revenue</p><p className="text-2xl font-bold">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 border-t-4 border-t-purple-500">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><ShieldAlert className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 font-medium">System Orders</p><p className="text-2xl font-bold">{stats?.totalOrders || 0}</p></div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Vendor Registrations Pending Review</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {vendors.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No registered vendors in the system.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Shop Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Owner Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vendors.map(vendor => (
                  <tr key={vendor._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{vendor.shopName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.userId?.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                        vendor.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        vendor.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vendor.approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {vendor.approvalStatus === 'pending' && (
                        <div className="flex justify-end space-x-2">
                           <button onClick={() => handleApprove(vendor._id)} className="text-green-600 hover:text-green-900"><CheckCircle className="w-6 h-6"/></button>
                           <button onClick={() => handleReject(vendor._id)} className="text-red-600 hover:text-red-900"><XCircle className="w-6 h-6"/></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
