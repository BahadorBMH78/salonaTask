import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ProductsFilter } from './ProductsFilter';

const ITEMS_PER_PAGE = 10;

interface Filters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'price' | 'name';
  sortOrder: 'asc' | 'desc';
}

export const ProductsList = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 2000,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const skip = (page - 1) * ITEMS_PER_PAGE;
  
  const { data, isLoading, error } = useProducts({
    skip,
    limit: ITEMS_PER_PAGE,
    ...filters,
  });

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  if (error) return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardFooter>
      </Card>
    </div>
  );

  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;

  return (
    <div className="space-y-6">
      <ProductsFilter onFilterChange={handleFilterChange} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardFooter>
                  <Skeleton className="h-8 w-1/2" />
                </CardFooter>
              </Card>
            ))
          : data?.products.map((product, index) => (
              <Card key={index} className="overflow-hidden flex flex-col">
                <div className="aspect-video relative">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader className="flex-grow">
                  <CardTitle className="line-clamp-1 text-lg sm:text-xl">{product.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-sm sm:text-base">{product.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <p className="text-xl sm:text-2xl font-bold">${product.price}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Stock: {product.stock}</p>
                  </div>
                  <Button className="w-full sm:w-auto">View Details</Button>
                </CardFooter>
              </Card>
            ))}
      </div>

      {totalPages > 0 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent className="flex-wrap">
              <PaginationItem>
                <PaginationPrevious 
                  size="default"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(pageNum => {
                  // Show first page, last page, current page, and pages around current page
                  return pageNum === 1 || 
                         pageNum === totalPages || 
                         Math.abs(pageNum - page) <= 1;
                })
                .map((pageNum, index, array) => {
                  // Add ellipsis if there's a gap
                  const showEllipsis = index > 0 && pageNum - array[index - 1] > 1;
                  return (
                    <React.Fragment key={pageNum}>
                      {showEllipsis && (
                        <PaginationItem>
                          <span className="px-4">...</span>
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          size="default"
                          onClick={() => setPage(pageNum)}
                          isActive={page === pageNum}
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
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}; 