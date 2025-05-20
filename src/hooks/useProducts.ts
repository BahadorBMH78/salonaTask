import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';

interface ProductsQueryParams {
  skip?: number;
  limit?: number;
  q?: string;
  sortBy?: 'title' | 'price';
  order?: 'asc' | 'desc';
}

export const useProducts = (params: ProductsQueryParams = {}) => {
  const { skip = 0, limit = 10, q, sortBy, order } = params;

  return useQuery({
    queryKey: ['products', skip, limit, q, sortBy, order],
    queryFn: () => productsApi.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}; 