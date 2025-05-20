import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { ChangeEvent } from 'react';

interface ProductsFilterProps {
  onFilterChange: (filters: {
    q: string;
    sortBy: string;
    order: 'asc' | 'desc';
  }) => void;
}

export const ProductsFilter = ({ onFilterChange }: ProductsFilterProps) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('title');
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

  const handleSortChange = (value: string) => {
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
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card border-b">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={handleSearch}
          className="pl-9 h-9"
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent 
            className="bg-popover border shadow-md"
            style={{
              backgroundColor: 'var(--popover)',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none'
            }}
          >
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="stock">Stock</SelectItem>
          </SelectContent>
        </Select>

        <Select value={order} onValueChange={handleOrderChange}>
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent 
            className="bg-popover border shadow-md"
            style={{
              backgroundColor: 'var(--popover)',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none'
            }}
          >
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}; 