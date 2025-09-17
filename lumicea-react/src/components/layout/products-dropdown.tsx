// lumicea-react/src/components/layout/products-dropdown.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase.ts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface ProductsDropdownProps {
  isScrolled?: boolean;
  isMobile?: boolean;
}

export function ProductsDropdown({ isScrolled, isMobile }: ProductsDropdownProps) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('name, slug').order('name');
      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data || []);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const linkClassNames = cn(
    'flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5'
  );

  if (isMobile) {
    // Mobile view: return a simple list of links
    return (
      <div className="flex flex-col space-y-1">
        {loading ? (
          <div className="text-sm text-gray-400 p-3">Loading...</div>
        ) : (
          categories.map((category) => (
            <Link key={category.slug} to={`/categories/${category.slug}`} className={linkClassNames}>
              <span className="font-medium">{category.name}</span>
            </Link>
          ))
        )}
      </div>
    );
  }

  // Desktop view: return a dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex items-center space-x-1 text-sm font-medium transition-colors duration-300',
          isScrolled
            ? 'text-gray-600 hover:text-lumicea-navy'
            : 'text-white/90 hover:text-lumicea-gold drop-shadow-sm'
        )}
      >
        <span>Products</span>
        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 w-56">
        {loading ? (
          <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
        ) : (
          categories.map((category) => (
            <Link key={category.slug} to={`/categories/${category.slug}`}>
              <DropdownMenuItem className="cursor-pointer">{category.name}</DropdownMenuItem>
            </Link>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
