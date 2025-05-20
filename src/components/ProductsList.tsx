import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ProductsFilter } from './ProductsFilter';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Eye, TrendingUp, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 12;

interface Filters {
  q: string;
  sortBy: 'price' | 'name';
  order: 'asc' | 'desc';
  category?: string;
}

export const ProductsList = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    q: '',
    sortBy: 'name',
    order: 'desc',
  });

  const skip = (page - 1) * ITEMS_PER_PAGE;
  
  const { data, isLoading, error } = useProducts({
    skip,
    limit: ITEMS_PER_PAGE,
    ...filters,
  });

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  if (error) return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[400px] px-4"
    >
      <Card className="w-full max-w-[400px] bg-background/95 backdrop-blur-sm border-0 shadow-lg shadow-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive">Oops! Something went wrong</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => window.location.reload()} variant="destructive">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProductsFilter onFilterChange={handleFilterChange} />
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden bg-background/95 backdrop-blur-sm border-0 shadow-lg shadow-primary/5">
                  <div className="relative">
                    <Skeleton className="h-48 w-full" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  </div>
                  <CardHeader className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardFooter>
                    <Skeleton className="h-8 w-1/2" />
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            data?.products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.08, delay: index * 0.08 }}
                className="group"
              >
                <Card className="relative overflow-hidden bg-background/95 backdrop-blur-sm border-0 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                

                    {/* Category Badge */}
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm border-0 shadow-sm"
                    >
                      {product.category}
                    </Badge>

                    {/* Rating Badge */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm border-0 shadow-sm">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                  </div>

                  <CardHeader className="flex-grow space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-1 text-lg font-semibold text-foreground/90">
                        {product.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2 text-sm text-muted-foreground/80">
                      {product.description}
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                          {product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                        {product.discountPercentage > 0 && (
                          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-0 shadow-sm">
                            -{product.discountPercentage}%
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                        <TrendingUp className="w-3 h-3" />
                        <span>Stock: {product.stock}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full sm:w-auto bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-300 border-0 shadow-sm"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {totalPages > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Pagination>
            <PaginationContent className="flex-wrap bg-background/95 backdrop-blur-sm p-2 rounded-lg border-0 shadow-lg shadow-primary/5">
              <PaginationItem>
                <PaginationPrevious 
                  size="default"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className={cn(
                    "hover:bg-primary hover:text-primary-foreground border-0",
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
                          onClick={() => setPage(pageNum)}
                          isActive={page === pageNum}
                          className="hover:bg-primary hover:text-primary-foreground border-0"
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
                  className={cn(
                    "hover:bg-primary hover:text-primary-foreground border-0",
                    page === totalPages && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}
    </div>
  );
}; 