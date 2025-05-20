import { type Product } from '../types/product';

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface Category {
  slug: string;
  name: string;
  url: string;
}

interface ProductsQueryParams {
  skip?: number;
  limit?: number;
  q?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const productsApi = {
  getProducts: async ({
    skip = 0,
    limit = 10,
    q,
    sortBy,
    order
  }: ProductsQueryParams = {}): Promise<ProductsResponse> => {
    let url = `${baseUrl}/products`;
    
    if (q) {
      url = `${baseUrl}/products/search`;
    }

    const params = new URLSearchParams();
    if (skip) params.append('skip', skip.toString());
    if (limit) params.append('limit', limit.toString());
    if (q) params.append('q', q);
    if (sortBy) params.append('sortBy', sortBy);
    if (order) params.append('order', order);

    const response = await fetch(`${url}?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${baseUrl}/products/categories`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }
}; 