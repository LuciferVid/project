import { apiSlice } from '../../app/apiSlice';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    initiateCheckout: builder.mutation({
      query: (data) => ({
        url: '/orders/checkout',
        method: 'POST',
        body: data, // { shippingAddress, paymentMethod }
      }),
    }),
    verifyAndCreateOrder: builder.mutation({
      query: (data) => ({
        url: '/orders/checkout/verify',
        method: 'POST',
        body: data, // { orderPreview, paymentData: { method, razorpayOrderId, razorpayPaymentId, razorpaySignature } }
      }),
      invalidatesTags: ['Cart', 'Order'],
    }),
    getMyOrders: builder.query({
      query: () => '/orders/me',
      providesTags: ['Order'],
    }),
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Order'],
    })
  }),
});

export const {
  useInitiateCheckoutMutation,
  useVerifyAndCreateOrderMutation,
  useGetMyOrdersQuery,
  useCancelOrderMutation
} = orderApi;
