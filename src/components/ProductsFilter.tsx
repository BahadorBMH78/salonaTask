import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { ChangeEvent } from 'react';

interface ProductsFilterProps {
  onFilterChange: (filters: {
    q: string;
    sortBy: 'price' | 'name';
    order: 'asc' | 'desc';
  }) => void;
}

export const ProductsFilter = ({ onFilterChange }: ProductsFilterProps) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'name'>('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({
      q: value,
      sortBy,
      order,
    });
  };

  const handleSortChange = (value: 'price' | 'name') => {
    setSortBy(value);
    onFilterChange({
      q: search,
      sortBy: value,
      order,
    });
  };

  const handleOrderChange = (value: 'asc' | 'desc') => {
    setOrder(value);
    onFilterChange({
      q: search,
      sortBy,
      order: value,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card/95 border-0 shadow-lg shadow-primary/5">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground z-20" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={handleSearch}
          className="pl-9 h-9 bg-background/80 backdrop-blur-sm border-0 shadow-sm focus-visible:ring-primary/50"
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[140px] h-9 bg-background/80 backdrop-blur-sm border-0 shadow-sm hover:bg-background/90">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent 
            className="bg-card/95 backdrop-blur-sm border-0 shadow-lg shadow-primary/5"
          >
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="stock">Stock</SelectItem>
          </SelectContent>
        </Select>

        <Select value={order} onValueChange={handleOrderChange}>
          <SelectTrigger className="w-[120px] h-9 bg-background/80 backdrop-blur-sm border-0 shadow-sm hover:bg-background/90">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent 
            className="bg-card/95 backdrop-blur-sm border-0 shadow-lg shadow-primary/5"
          >
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}; 