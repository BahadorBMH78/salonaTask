import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';

interface ProductsQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export const useProducts = (params: ProductsQueryParams = {}) => {
  const { skip = 0, limit = 10, search, category, minPrice, maxPrice, sortBy, sortOrder } = params;

  return useQuery({
    queryKey: ['products', skip, limit, search, category, minPrice, maxPrice, sortBy, sortOrder],
    queryFn: () => productsApi.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}; 