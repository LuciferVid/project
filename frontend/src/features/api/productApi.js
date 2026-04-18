import { apiSlice } from '../../app/apiSlice';

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => {
        let queryString = '?';
        if (params) {
          Object.keys(params).forEach(key => {
            if (params[key]) queryString += `${key}=${params[key]}&`;
          });
        }
        return `/products${queryString}`;
      },
      providesTags: (result) => 
        result ? [
          ...result.data.products.map(({ _id }) => ({ type: 'Product', id: _id })),
          { type: 'Product', id: 'LIST' },
        ] : [{ type: 'Product', id: 'LIST' }],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery
} = productApi;
