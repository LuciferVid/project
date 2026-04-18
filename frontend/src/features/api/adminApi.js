import { apiSlice } from '../../app/apiSlice';

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query({
      query: () => '/admin/dashboard',
      providesTags: ['Vendor', 'Order', 'User'],
    }),
    getAdminVendors: builder.query({
      query: () => '/admin/vendors',
      providesTags: ['Vendor'],
    }),
    approveVendor: builder.mutation({
      query: (id) => ({
        url: `/admin/vendors/${id}/approve`,
        method: 'PATCH'
      }),
      invalidatesTags: ['Vendor'],
    }),
    rejectVendor: builder.mutation({
      query: (id) => ({
        url: `/admin/vendors/${id}/reject`,
        method: 'PATCH'
      }),
      invalidatesTags: ['Vendor'],
    }),
    getAllSystemOrders: builder.query({
      query: () => '/orders/admin',
      providesTags: ['Order'],
    })
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetAdminVendorsQuery,
  useApproveVendorMutation,
  useRejectVendorMutation,
  useGetAllSystemOrdersQuery
} = adminApi;
