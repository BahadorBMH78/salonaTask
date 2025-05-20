import React, { useState, useCallback } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductsFilter } from './ProductsFilter';
import { useDebounce } from '@/hooks/useDebounce';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/product';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 12;

export const ProductsList = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'price'>('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  
  const debouncedSearch = useDebounce(search, 300);
  const skip = (page - 1) * ITEMS_PER_PAGE;
  
  const { data, isLoading, error } = useProducts({
    q: debouncedSearch,
    sortBy,
    order,
    skip,
    limit: ITEMS_PER_PAGE,
  });

  if (error) {
    return (
      <div className="p-4 text-destructive">
        Error loading products: {error.message}
      </div>
    );
  }

  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;

  const handlePreviousPage = useCallback(() => {
    setPage(p => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage(p => Math.min(totalPages, p + 1));
  }, [totalPages]);

  const handlePageChange = useCallback((pageNum: number) => {
    setPage(pageNum);
  }, []);

  return (
    <div className="space-y-4">
      <ProductsFilter
        search={search}
        sortBy={sortBy}
        order={order}
        onSearchChange={setSearch}
        onSortChange={setSortBy}
        onOrderChange={setOrder}
      />
      
      {isLoading ? (
        <div className="p-4 text-muted-foreground">Loading products...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data?.products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent className="flex-wrap bg-card backdrop-blur-sm p-2 rounded-lg border-0 shadow-lg shadow-primary/5">
                  <PaginationItem>
                    <PaginationPrevious 
                      size="default"
                      onClick={handlePreviousPage}
                      className={cn(
                        "hover:bg-primary hover:text-white border-0 cursor-pointer",
                        page === 1 && "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(pageNum => {
                      return pageNum === 1 || 
                             pageNum === totalPages || 
                             Math.abs(pageNum - page) <= 1;
                    })
                    .map((pageNum, index, array) => {
                      const showEllipsis = index > 0 && pageNum - array[index - 1] > 1;
                      return (
                        <React.Fragment key={pageNum}>
                          {showEllipsis && (
                            <PaginationItem>
                              <span className="px-4 text-muted-foreground">...</span>
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              size="default"
                              onClick={() => handlePageChange(pageNum)}
                              isActive={page === pageNum}
                              className="hover:bg-primary hover:text-white border-0 cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        </React.Fragment>
                      );
                    })}
                  <PaginationItem>
                    <PaginationNext
                      size="default"
                      onClick={handleNextPage}
                      className={cn(
                        "hover:bg-primary hover:text-white border-0 cursor-pointer",
                        page === totalPages && "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}; 