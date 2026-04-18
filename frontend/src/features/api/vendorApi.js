import { apiSlice } from '../../app/apiSlice';

export const vendorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendorAnalytics: builder.query({
      query: () => '/vendor/analytics',
      providesTags: ['Vendor'],
    }),
    getVendorOrders: builder.query({
      query: () => '/orders/vendor',
      providesTags: ['Order'],
    }),
    updateItemStatus: builder.mutation({
      query: ({ orderId, itemId, status }) => ({
        url: `/orders/vendor/${orderId}/items/${itemId}`,
        method: 'PATCH',
        body: { status }
      }),
      invalidatesTags: ['Order'],
    }),
    // Products
    addVendorProduct: builder.mutation({
      query: (formData) => ({
        url: '/products',
        method: 'POST',
        body: formData, // FormData for multer
      }),
      invalidatesTags: ['Product'],
    })
  }),
});

export const {
  useGetVendorAnalyticsQuery,
  useGetVendorOrdersQuery,
  useUpdateItemStatusMutation,
  useAddVendorProductMutation
} = vendorApi;
