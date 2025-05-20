import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Package } from 'lucide-react';
import { Product } from '@/types/product';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className="relative overflow-hidden bg-background/95 backdrop-blur-sm border-0 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="aspect-video relative overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "object-cover w-full h-full transition-transform duration-500 group-hover:scale-105",
            !imageLoaded && "opacity-0"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm border-0 shadow-sm"
        >
          {product.category}
        </Badge>

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
            <Package className="w-3 h-3" />
            <span>Stock: {product.stock}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}; 